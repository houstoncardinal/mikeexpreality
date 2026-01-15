import { useConversation } from "@elevenlabs/react";
import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, X, Bot, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function VoiceAgentWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [lastToken, setLastToken] = useState<string | null>(null);
  
  // Refs for managing reconnection and keep-alive
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const keepAliveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isManualDisconnectRef = useRef(false);
  const maxReconnectAttempts = 3;

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs agent");
      toast.success("Connected to voice assistant");
      setConnectionAttempts(0);
      isManualDisconnectRef.current = false;
      
      // Start keep-alive mechanism - send user activity every 15 seconds
      startKeepAlive();
    },
    onDisconnect: () => {
      console.log("Disconnected from agent");
      stopKeepAlive();
      
      // Only attempt reconnection if it wasn't a manual disconnect
      if (!isManualDisconnectRef.current && isOpen && connectionAttempts < maxReconnectAttempts) {
        console.log(`Connection lost. Attempting reconnect (${connectionAttempts + 1}/${maxReconnectAttempts})...`);
        toast.info("Connection lost. Reconnecting...");
        
        // Clear any existing reconnect timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, connectionAttempts) * 1000;
        reconnectTimeoutRef.current = setTimeout(() => {
          setConnectionAttempts(prev => prev + 1);
          attemptReconnect();
        }, delay);
      } else if (connectionAttempts >= maxReconnectAttempts) {
        toast.error("Unable to maintain connection. Please try again.");
        setConnectionAttempts(0);
      }
    },
    onMessage: (message) => {
      console.log("Message:", message);
      // Reset inactivity on any message
      resetKeepAlive();
    },
    onError: (error) => {
      console.error("Conversation error:", error);
      
      // Don't show error toast if we're going to reconnect
      if (connectionAttempts >= maxReconnectAttempts || isManualDisconnectRef.current) {
        toast.error("Voice connection error. Please try again.");
      }
    },
  });

  // Keep-alive mechanism to prevent idle disconnection
  const startKeepAlive = useCallback(() => {
    stopKeepAlive();
    
    keepAliveIntervalRef.current = setInterval(() => {
      if (conversation.status === "connected") {
        try {
          // Send user activity signal to keep the connection alive
          conversation.sendUserActivity();
          console.log("Keep-alive: sent user activity signal");
        } catch (error) {
          console.warn("Keep-alive signal failed:", error);
        }
      }
    }, 15000); // Every 15 seconds
  }, [conversation]);

  const stopKeepAlive = useCallback(() => {
    if (keepAliveIntervalRef.current) {
      clearInterval(keepAliveIntervalRef.current);
      keepAliveIntervalRef.current = null;
    }
  }, []);

  const resetKeepAlive = useCallback(() => {
    if (conversation.status === "connected") {
      startKeepAlive();
    }
  }, [conversation.status, startKeepAlive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopKeepAlive();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [stopKeepAlive]);

  const fetchToken = useCallback(async () => {
    const { data, error } = await supabase.functions.invoke(
      "elevenlabs-conversation-token"
    );

    if (error) {
      throw new Error(error.message || "Failed to get conversation token");
    }

    if (!data?.token) {
      throw new Error("No token received");
    }

    setLastToken(data.token);
    return data.token;
  }, []);

  const attemptReconnect = useCallback(async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    try {
      // Get a fresh token for reconnection
      const token = await fetchToken();
      
      await conversation.startSession({
        conversationToken: token,
        connectionType: "webrtc",
      });
    } catch (error) {
      console.error("Reconnection failed:", error);
      // The onDisconnect handler will attempt another reconnect if within limits
    } finally {
      setIsConnecting(false);
    }
  }, [conversation, fetchToken, isConnecting]);

  const startConversation = useCallback(async () => {
    setIsConnecting(true);
    isManualDisconnectRef.current = false;
    setConnectionAttempts(0);
    
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Get token from edge function
      const token = await fetchToken();

      // Start the conversation with WebRTC
      await conversation.startSession({
        conversationToken: token,
        connectionType: "webrtc",
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          toast.error("Microphone access is required for voice chat");
        } else {
          toast.error(error.message || "Failed to connect. Please try again.");
        }
      }
    } finally {
      setIsConnecting(false);
    }
  }, [conversation, fetchToken]);

  const stopConversation = useCallback(async () => {
    isManualDisconnectRef.current = true;
    stopKeepAlive();
    
    // Clear any pending reconnect attempts
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    setConnectionAttempts(0);
    await conversation.endSession();
  }, [conversation, stopKeepAlive]);

  const handleClose = useCallback(() => {
    if (conversation.status === "connected") {
      stopConversation();
    }
    setIsOpen(false);
  }, [conversation.status, stopConversation]);

  const handleRetry = useCallback(() => {
    setConnectionAttempts(0);
    startConversation();
  }, [startConversation]);

  const isConnected = conversation.status === "connected";
  const showRetryButton = connectionAttempts >= maxReconnectAttempts;

  return (
    <>
      {/* Voice Agent Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-royal to-royal/80 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group md:bottom-6 md:right-6"
        aria-label="Open voice assistant"
      >
        <Bot className="w-6 h-6 group-hover:scale-110 transition-transform" />
        
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-royal/30 animate-ping" />
      </motion.button>

      {/* Voice Agent Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none md:pointer-events-none"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-24 right-4 z-50 w-[calc(100%-2rem)] max-w-sm bg-card border border-border rounded-2xl shadow-2xl overflow-hidden md:bottom-24 md:right-6 md:w-80"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-royal to-royal/80 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    {isConnected && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Mike O AI</h3>
                    <p className="text-xs text-muted-foreground">
                      {isConnecting ? "Connecting..." : isConnected ? "Active" : showRetryButton ? "Connection failed" : "Ready to chat"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                  aria-label="Close voice assistant"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col items-center">
                {/* Microphone Visualization */}
                <div className="relative mb-6">
                  <motion.div
                    animate={
                      isConnected && conversation.isSpeaking
                        ? { scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }
                        : { scale: 1, opacity: 0.3 }
                    }
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-royal/20"
                  />
                  <motion.div
                    animate={
                      isConnected && conversation.isSpeaking
                        ? { scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }
                        : { scale: 1, opacity: 0.2 }
                    }
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                    className="absolute inset-0 rounded-full bg-royal/20 scale-125"
                  />
                  <div
                    className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
                      isConnected
                        ? "bg-gradient-to-br from-green-500 to-green-600"
                        : isConnecting
                        ? "bg-gradient-to-br from-yellow-500 to-orange-500"
                        : showRetryButton
                        ? "bg-gradient-to-br from-red-500 to-red-600"
                        : "bg-gradient-to-br from-royal to-royal/80"
                    }`}
                  >
                    {isConnecting ? (
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    ) : isConnected ? (
                      <Mic className="w-8 h-8 text-white" />
                    ) : showRetryButton ? (
                      <RefreshCw className="w-8 h-8 text-white" />
                    ) : (
                      <MicOff className="w-8 h-8 text-white" />
                    )}
                  </div>
                </div>

                {/* Status Text */}
                <p className="text-center text-sm text-muted-foreground mb-6">
                  {isConnecting
                    ? "Establishing secure connection..."
                    : isConnected
                    ? conversation.isSpeaking
                      ? "Mike O AI is speaking..."
                      : "Listening... Speak naturally"
                    : showRetryButton
                    ? "Connection couldn't be maintained. Tap to retry."
                    : "Tap the button below to start talking with Mike O AI"}
                </p>

                {/* Action Button */}
                {showRetryButton ? (
                  <button
                    onClick={handleRetry}
                    className="w-full py-3 px-6 rounded-xl font-medium transition-all bg-royal text-white hover:bg-royal/90"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Retry Connection
                    </span>
                  </button>
                ) : isConnected ? (
                  <button
                    onClick={stopConversation}
                    className="w-full py-3 px-6 rounded-xl font-medium transition-all bg-red-500 text-white hover:bg-red-600"
                  >
                    End Conversation
                  </button>
                ) : (
                  <button
                    onClick={startConversation}
                    disabled={isConnecting}
                    className="w-full py-3 px-6 rounded-xl font-medium transition-all bg-royal text-white hover:bg-royal/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isConnecting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Connecting...
                      </span>
                    ) : (
                      "Start Conversation"
                    )}
                  </button>
                )}

                {/* Reconnection indicator */}
                {connectionAttempts > 0 && connectionAttempts < maxReconnectAttempts && (
                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    Reconnecting... Attempt {connectionAttempts}/{maxReconnectAttempts}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 pb-4">
                <p className="text-xs text-center text-muted-foreground">
                  Your conversation is private and secure
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
