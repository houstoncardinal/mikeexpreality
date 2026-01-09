import { useConversation } from "@elevenlabs/react";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, X, Bot, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function VoiceAgentWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs agent");
      toast.success("Connected to voice assistant");
    },
    onDisconnect: () => {
      console.log("Disconnected from agent");
    },
    onMessage: (message) => {
      console.log("Message:", message);
    },
    onError: (error) => {
      console.error("Conversation error:", error);
      toast.error("Voice connection error. Please try again.");
    },
  });

  const startConversation = useCallback(async () => {
    setIsConnecting(true);
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Get token from edge function
      const { data, error } = await supabase.functions.invoke(
        "elevenlabs-conversation-token"
      );

      if (error) {
        throw new Error(error.message || "Failed to get conversation token");
      }

      if (!data?.token) {
        throw new Error("No token received");
      }

      // Start the conversation with WebRTC
      await conversation.startSession({
        conversationToken: data.token,
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
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const handleClose = useCallback(() => {
    if (conversation.status === "connected") {
      stopConversation();
    }
    setIsOpen(false);
  }, [conversation.status, stopConversation]);

  const isConnected = conversation.status === "connected";

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
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-royal to-royal/80 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Voice Assistant</h3>
                    <p className="text-xs text-muted-foreground">
                      {isConnected ? (conversation.isSpeaking ? "Speaking..." : "Listening...") : "Ready to help"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                  aria-label="Close voice assistant"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col items-center">
                {/* Status indicator */}
                <div className="relative mb-6">
                  <motion.div
                    animate={isConnected ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className={`w-24 h-24 rounded-full flex items-center justify-center ${
                      isConnected
                        ? conversation.isSpeaking
                          ? "bg-emerald-500/20"
                          : "bg-royal/20"
                        : "bg-muted"
                    }`}
                  >
                    {isConnecting ? (
                      <Loader2 className="w-10 h-10 text-royal animate-spin" />
                    ) : isConnected ? (
                      <Mic className={`w-10 h-10 ${conversation.isSpeaking ? "text-emerald-500" : "text-royal"}`} />
                    ) : (
                      <MicOff className="w-10 h-10 text-muted-foreground" />
                    )}
                  </motion.div>
                  
                  {/* Audio visualization rings */}
                  {isConnected && (
                    <>
                      <motion.div
                        animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute inset-0 rounded-full border-2 border-royal/50"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
                        className="absolute inset-0 rounded-full border-2 border-royal/30"
                      />
                    </>
                  )}
                </div>

                {/* Instructions */}
                <p className="text-sm text-muted-foreground text-center mb-6">
                  {isConnected
                    ? "Speak naturally — I'm listening and ready to help with your real estate questions."
                    : "Start a conversation with our AI assistant for personalized property guidance."}
                </p>

                {/* Action button */}
                {isConnected ? (
                  <button
                    onClick={stopConversation}
                    className="w-full py-3 px-4 bg-destructive text-destructive-foreground rounded-xl font-medium hover:bg-destructive/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <MicOff className="w-5 h-5" />
                    End Conversation
                  </button>
                ) : (
                  <button
                    onClick={startConversation}
                    disabled={isConnecting}
                    className="w-full py-3 px-4 bg-gradient-to-r from-royal to-royal/80 text-white rounded-xl font-medium hover:from-royal/90 hover:to-royal/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5" />
                        Start Conversation
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
