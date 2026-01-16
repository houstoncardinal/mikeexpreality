import { useConversation } from "@elevenlabs/react";
import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, X, Bot, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TranscriptMessage {
  id: string;
  role: "user" | "agent";
  text: string;
  timestamp: Date;
}

export function VoiceAgentWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [lastToken, setLastToken] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [inputVolume, setInputVolume] = useState(0);
  const [outputVolume, setOutputVolume] = useState(0);
  
  // Refs for managing reconnection, keep-alive, and audio visualization
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const keepAliveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const volumeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isManualDisconnectRef = useRef(false);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const conversationRef = useRef<ReturnType<typeof useConversation> | null>(null);
  const maxReconnectAttempts = 3;

  // Keep-alive mechanism functions using refs for stability
  const stopKeepAlive = useCallback(() => {
    if (keepAliveIntervalRef.current) {
      clearInterval(keepAliveIntervalRef.current);
      keepAliveIntervalRef.current = null;
    }
  }, []);

  const stopVolumeMonitoring = useCallback(() => {
    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current);
      volumeIntervalRef.current = null;
    }
    setInputVolume(0);
    setOutputVolume(0);
  }, []);

  const startKeepAlive = useCallback(() => {
    stopKeepAlive();
    
    keepAliveIntervalRef.current = setInterval(() => {
      if (conversationRef.current?.status === "connected") {
        try {
          conversationRef.current.sendUserActivity();
          console.log("Keep-alive: sent user activity signal");
        } catch (error) {
          console.warn("Keep-alive signal failed:", error);
        }
      }
    }, 15000);
  }, [stopKeepAlive]);

  const startVolumeMonitoring = useCallback(() => {
    stopVolumeMonitoring();
    
    volumeIntervalRef.current = setInterval(() => {
      if (conversationRef.current?.status === "connected") {
        try {
          const input = conversationRef.current.getInputVolume();
          const output = conversationRef.current.getOutputVolume();
          setInputVolume(input);
          setOutputVolume(output);
        } catch (error) {
          // Silently handle errors during volume monitoring
        }
      }
    }, 50);
  }, [stopVolumeMonitoring]);

  const resetKeepAlive = useCallback(() => {
    if (conversationRef.current?.status === "connected") {
      startKeepAlive();
    }
  }, [startKeepAlive]);

  // Initialize conversation hook
  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs agent");
      toast.success("Connected to voice assistant");
      setConnectionAttempts(0);
      isManualDisconnectRef.current = false;
      
      startKeepAlive();
      startVolumeMonitoring();
    },
    onDisconnect: () => {
      console.log("Disconnected from agent");
      stopKeepAlive();
      stopVolumeMonitoring();
      
      if (!isManualDisconnectRef.current && connectionAttempts < maxReconnectAttempts) {
        console.log(`Connection lost. Attempting reconnect (${connectionAttempts + 1}/${maxReconnectAttempts})...`);
        toast.info("Connection lost. Reconnecting...");
        
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        
        const delay = Math.pow(2, connectionAttempts) * 1000;
        reconnectTimeoutRef.current = setTimeout(() => {
          setConnectionAttempts(prev => prev + 1);
        }, delay);
      } else if (connectionAttempts >= maxReconnectAttempts) {
        toast.error("Unable to maintain connection. Please try again.");
        setConnectionAttempts(0);
      }
    },
    onMessage: (message) => {
      console.log("Message:", message);
      resetKeepAlive();
      
      const msgAny = message as any;
      const msgType = msgAny?.type || msgAny?.message?.type;
      
      if (msgType === "user_transcript") {
        const userTranscript = msgAny?.user_transcription_event?.user_transcript || 
                               msgAny?.message?.user_transcription_event?.user_transcript;
        if (userTranscript) {
          setTranscript(prev => [...prev, {
            id: `user-${Date.now()}`,
            role: "user",
            text: userTranscript,
            timestamp: new Date()
          }]);
        }
      } else if (msgType === "agent_response") {
        const agentResponse = msgAny?.agent_response_event?.agent_response ||
                              msgAny?.message?.agent_response_event?.agent_response;
        if (agentResponse) {
          setTranscript(prev => [...prev, {
            id: `agent-${Date.now()}`,
            role: "agent",
            text: agentResponse,
            timestamp: new Date()
          }]);
        }
      } else if (msgType === "agent_response_correction") {
        const correctedResponse = msgAny?.agent_response_correction_event?.corrected_agent_response ||
                                  msgAny?.message?.agent_response_correction_event?.corrected_agent_response;
        if (correctedResponse) {
          setTranscript(prev => {
            const newTranscript = [...prev];
            let lastAgentIdx = -1;
            for (let i = newTranscript.length - 1; i >= 0; i--) {
              if (newTranscript[i].role === "agent") {
                lastAgentIdx = i;
                break;
              }
            }
            if (lastAgentIdx !== -1) {
              newTranscript[lastAgentIdx] = {
                ...newTranscript[lastAgentIdx],
                text: correctedResponse
              };
            }
            return newTranscript;
          });
        }
      }
    },
    onError: (error) => {
      console.error("Conversation error:", error);
      
      if (connectionAttempts >= maxReconnectAttempts || isManualDisconnectRef.current) {
        toast.error("Voice connection error. Please try again.");
      }
    },
  });

  // Store conversation in ref for callbacks
  useEffect(() => {
    conversationRef.current = conversation;
  }, [conversation]);

  // Auto-scroll transcript to bottom
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [transcript]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopKeepAlive();
      stopVolumeMonitoring();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [stopKeepAlive, stopVolumeMonitoring]);

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
      const token = await fetchToken();
      
      await conversation.startSession({
        signedUrl: token,
      });
    } catch (error) {
      console.error("Reconnection failed:", error);
    } finally {
      setIsConnecting(false);
    }
  }, [conversation, fetchToken, isConnecting]);

  // Effect to handle reconnection attempts
  useEffect(() => {
    if (connectionAttempts > 0 && connectionAttempts < maxReconnectAttempts && !isManualDisconnectRef.current) {
      attemptReconnect();
    }
  }, [connectionAttempts, attemptReconnect]);

  const startConversation = useCallback(async () => {
    setIsConnecting(true);
    isManualDisconnectRef.current = false;
    setConnectionAttempts(0);
    setTranscript([]);
    
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const token = await fetchToken();

      await conversation.startSession({
        signedUrl: token,
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
    stopVolumeMonitoring();
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    setConnectionAttempts(0);
    await conversation.endSession();
  }, [conversation, stopKeepAlive, stopVolumeMonitoring]);

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

  // Generate waveform bars based on volume
  const generateWaveformBars = (volume: number, count: number) => {
    return Array.from({ length: count }, (_, i) => {
      const baseHeight = 0.2;
      const variation = Math.sin((i / count) * Math.PI) * 0.5 + 0.5;
      const height = baseHeight + (volume * variation * 0.8);
      return Math.min(1, height);
    });
  };

  const inputBars = generateWaveformBars(inputVolume, 5);
  const outputBars = generateWaveformBars(outputVolume, 7);

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
              className="fixed bottom-24 right-4 z-50 w-[calc(100%-2rem)] max-w-sm bg-card border border-border rounded-2xl shadow-2xl overflow-hidden md:bottom-24 md:right-6 md:w-96"
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

              {/* Audio Waveform Visualization */}
              {isConnected && (
                <div className="px-4 py-3 border-b border-border bg-muted/30">
                  <div className="flex items-center justify-between gap-4">
                    {/* User (Input) Waveform */}
                    <div className="flex-1">
                      <p className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider">You</p>
                      <div className="flex items-center justify-center gap-1 h-8">
                        {inputBars.map((height, i) => (
                          <motion.div
                            key={`input-${i}`}
                            className="w-1.5 bg-gradient-to-t from-green-500 to-green-400 rounded-full"
                            animate={{ height: `${height * 100}%` }}
                            transition={{ duration: 0.05 }}
                            style={{ minHeight: "4px" }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Divider */}
                    <div className="h-10 w-px bg-border" />
                    
                    {/* Agent (Output) Waveform */}
                    <div className="flex-1">
                      <p className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider text-right">Mike O</p>
                      <div className="flex items-center justify-center gap-1 h-8">
                        {outputBars.map((height, i) => (
                          <motion.div
                            key={`output-${i}`}
                            className="w-1.5 bg-gradient-to-t from-royal to-royal/80 rounded-full"
                            animate={{ height: `${height * 100}%` }}
                            transition={{ duration: 0.05 }}
                            style={{ minHeight: "4px" }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Transcript Area */}
              {isConnected && (
                <ScrollArea className="h-48">
                  <div className="px-4 py-3">
                    {transcript.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                        <p>Start speaking to see the conversation...</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {transcript.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                                message.role === "user"
                                  ? "bg-royal text-white rounded-br-sm"
                                  : "bg-muted text-foreground rounded-bl-sm"
                              }`}
                            >
                              <p>{message.text}</p>
                              <p className={`text-[10px] mt-1 ${
                                message.role === "user" ? "text-white/60" : "text-muted-foreground"
                              }`}>
                                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                        <div ref={transcriptEndRef} />
                      </div>
                    )}
                  </div>
                </ScrollArea>
              )}

              {/* Content - Microphone Visualization (when not connected) */}
              {!isConnected && (
                <div className="p-6 flex flex-col items-center">
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

                  <p className="text-center text-sm text-muted-foreground mb-6">
                    {isConnecting
                      ? "Establishing secure connection..."
                      : showRetryButton
                      ? "Connection couldn't be maintained. Tap to retry."
                      : "Tap the button below to start talking with Mike O AI"}
                  </p>

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

                  {connectionAttempts > 0 && connectionAttempts < maxReconnectAttempts && (
                    <p className="text-xs text-muted-foreground mt-3 text-center">
                      Reconnecting... Attempt {connectionAttempts}/{maxReconnectAttempts}
                    </p>
                  )}
                </div>
              )}

              {/* Action Button (when connected) */}
              {isConnected && (
                <div className="p-4 border-t border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-2 h-2 rounded-full ${conversation.isSpeaking ? "bg-royal animate-pulse" : "bg-green-500"}`} />
                    <p className="text-sm text-muted-foreground">
                      {conversation.isSpeaking ? "Mike O is speaking..." : "Listening..."}
                    </p>
                  </div>
                  <button
                    onClick={stopConversation}
                    className="w-full py-3 px-6 rounded-xl font-medium transition-all bg-red-500 text-white hover:bg-red-600"
                  >
                    End Conversation
                  </button>
                </div>
              )}

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
