import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Brain,
  MessageCircle,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

interface AICoachProps {
  activeInstrument: string;
  currentExperiment: any;
}

interface CoachMessage {
  id: string;
  type: "suggestion" | "warning" | "tip" | "success" | "info";
  message: string;
  timestamp: Date;
}

const INSTRUMENTS = ["hplc", "gcms", "uvvis"];

/**
 * AI chemistry coach with improved validation and tabbed layout.
 */
export function AICoach({ activeInstrument, currentExperiment }: AICoachProps) {
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [learningProgress, setLearningProgress] = useState({
    hplc: 45,
    gcms: 30,
    uvvis: 60,
  });
  const [tab, setTab] = useState("progress");

  useEffect(() => {
    generateCoachingMessage();
  }, [activeInstrument, currentExperiment]);

  /**
   * Generates a contextual message depending on instrument and experiment state.
   */
  const generateCoachingMessage = () => {
    // warn if instrument is not recognised
    if (!INSTRUMENTS.includes(activeInstrument)) {
      addMessage({
        type: "warning",
        message: `Unknown instrument: ${activeInstrument}. Results may be unreliable.`,
      });
      return;
    }

    const instrumentTips = {
      hplc: [
        "For better resolution, try reducing the flow rate to 0.8 mL/min",
        "Temperature control is crucial - slight increases can improve peak shape",
        "Consider adjusting your mobile phase ratio for better separation",
        "Check if your injection volume is appropriate for the column capacity",
      ],
      gcms: [
        "Optimize your temperature program for better compound separation",
        "Split ratios affect sensitivity - use splitless for trace analysis",
        "MS fragmentation patterns help confirm compound identity",
        "Carrier gas flow rate impacts resolution and analysis time",
      ],
      uvvis: [
        "DNA purity is assessed by the 260/280 ratio - aim for 1.8-2.0",
        "Scan speed affects signal-to-noise ratio - slower is often better",
        "Consider your wavelength range based on your analyte",
        "Path length directly affects absorbance according to Beer's Law",
      ],
    } as const;

    const currentTips =
      instrumentTips[activeInstrument as keyof typeof instrumentTips] || [];
    const randomTip = currentTips[Math.floor(Math.random() * currentTips.length)];

    if (currentExperiment?.results?.valid) {
      addMessage({
        type: "success",
        message: `Great job! Your ${activeInstrument.toUpperCase()} analysis shows good results.`,
      });
    } else if (currentExperiment?.results && !currentExperiment.results.valid) {
      addMessage({
        type: "warning",
        message: `The current results appear inconsistent. Please verify your ${activeInstrument.toUpperCase()} setup.`,
      });
    } else {
      addMessage({
        type: "tip",
        message: randomTip,
      });
    }
  };

  const addMessage = (messageData: Omit<CoachMessage, "id" | "timestamp">) => {
    const newMessage: CoachMessage = {
      id: Date.now().toString(),
      timestamp: new Date(),
      ...messageData,
    };
    setMessages((prev) => [newMessage, ...prev].slice(0, 10));
  };

  const getMessageIcon = (type: CoachMessage["type"]) => {
    switch (type) {
      case "suggestion":
        return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "tip":
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "info":
        return <MessageCircle className="h-4 w-4 text-muted-foreground" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getMessageStyle = (type: CoachMessage["type"]) => {
    switch (type) {
      case "suggestion":
        return "border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20";
      case "warning":
        return "border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-950/20";
      case "tip":
        return "border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20";
      case "success":
        return "border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20";
      case "info":
        return "border-l-4 border-gray-500 bg-gray-50 dark:bg-gray-950/20";
      default:
        return "border-l-4 border-gray-500 bg-gray-50 dark:bg-gray-950/20";
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Chemistry Coach
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={tab} onValueChange={setTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
            <TabsTrigger value="focus">Focus</TabsTrigger>
          </TabsList>

          {/* Learning Progress */}
          <TabsContent value="progress" className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Learning Progress
            </h4>
            {INSTRUMENTS.map((inst) => (
              <div key={inst} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs">
                    {inst.toUpperCase()} {inst === "hplc" ? "Mastery" : inst === "gcms" ? "Skills" : "Expertise"}
                  </span>
                  <span className="text-xs font-medium">{learningProgress[inst as keyof typeof learningProgress]}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${learningProgress[inst as keyof typeof learningProgress]}%` }}
                  />
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Coach Messages */}
          <TabsContent value="messages" className="space-y-3">
            <h4 className="text-sm font-medium">Real-time Guidance</h4>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    Start an experiment to receive AI guidance
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-md text-sm ${getMessageStyle(message.type)}`}
                    >
                      <div className="flex items-start gap-2">
                        {getMessageIcon(message.type)}
                        <div className="flex-1">
                          <p>{message.message}</p>
                          <span className="text-xs opacity-70 mt-1 block">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Quick Actions */}
          <TabsContent value="actions" className="space-y-2">
            <h4 className="text-sm font-medium">Quick Actions</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  addMessage({
                    type: "suggestion",
                    message: `For ${activeInstrument.toUpperCase()}: Try optimizing your method parameters for better sensitivity.`,
                  })
                }
              >
                Get Suggestion
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  addMessage({
                    type: "tip",
                    message: "Remember to run blanks and standards for proper calibration!",
                  })
                }
              >
                Method Tip
              </Button>
            </div>
          </TabsContent>

          {/* Current Focus */}
          <TabsContent value="focus">
            <div className="bg-primary/10 rounded-md p-3">
              <h4 className="text-sm font-medium mb-2">Current Focus</h4>
              <Badge variant="secondary" className="mb-2">
                {activeInstrument.toUpperCase()} Optimization
              </Badge>
              <p className="text-xs text-muted-foreground">
                Focus on method development and parameter optimization for your current instrument.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

