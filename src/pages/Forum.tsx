import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare, Plus, Send } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Answer {
  id: string;
  content: string;
  created_at: string;
  profiles?: {
    full_name: string;
  } | null;
}

interface Question {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  profiles?: {
    full_name: string;
  } | null;
  answers: Answer[];
}

const Forum = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [answerContent, setAnswerContent] = useState("");
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    content: "",
    category: "",
  });

  useEffect(() => {
    fetchQuestions();

    const channel = supabase
      .channel("forum_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "questions" }, () => {
        fetchQuestions();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "answers" }, () => {
        fetchQuestions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setQuestions(data.map(q => ({ ...q, answers: [] })));
    }
    setLoading(false);
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase.from("questions").insert({
      user_id: user.id,
      title: newQuestion.title,
      content: newQuestion.content,
      category: newQuestion.category,
    });

    if (error) {
      toast.error("Failed to create question");
    } else {
      toast.success("Question posted successfully!");
      setNewQuestion({ title: "", content: "", category: "" });
    }
  };

  const handlePostAnswer = async (questionId: string) => {
    if (!user || !answerContent.trim()) return;

    const { error } = await supabase.from("answers").insert({
      question_id: questionId,
      user_id: user.id,
      content: answerContent,
    });

    if (error) {
      toast.error("Failed to post answer");
    } else {
      toast.success("Answer posted successfully!");
      setAnswerContent("");
      setSelectedQuestion(null);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      health: "bg-destructive/10 text-destructive",
      feeding: "bg-primary/10 text-primary",
      breeding: "bg-secondary/10 text-secondary",
      marketing: "bg-accent/10 text-accent",
      general: "bg-muted text-muted-foreground",
    };
    return colors[category] || colors.general;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading forum...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Q&A Forum</h1>
          <p className="text-muted-foreground">Ask questions and share knowledge with the community</p>
        </div>
        {user && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ask Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Ask a Question</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateQuestion} className="space-y-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={newQuestion.category} onValueChange={(value) => setNewQuestion({ ...newQuestion, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="feeding">Feeding</SelectItem>
                      <SelectItem value="breeding">Breeding</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    placeholder="What's your question?"
                    value={newQuestion.title}
                    onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Details</Label>
                  <Textarea
                    placeholder="Provide more details about your question..."
                    value={newQuestion.content}
                    onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                    rows={4}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Post Question</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-4">
        {questions.map((question) => (
          <Card key={question.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-xl">{question.title}</CardTitle>
                    <Badge className={getCategoryColor(question.category)}>
                      {question.category}
                    </Badge>
                  </div>
                  <CardDescription>
                    Asked {formatDistanceToNow(new Date(question.created_at), { addSuffix: true })}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {question.answers?.length || 0}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{question.content}</p>

              {question.answers && question.answers.length > 0 && (
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-semibold text-sm">Answers</h4>
                  {question.answers.map((answer) => (
                    <div key={answer.id} className="bg-muted/50 rounded-lg p-3 space-y-1">
                      <p className="text-sm">{answer.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {answer.profiles?.full_name || "Unknown"} •{" "}
                        {formatDistanceToNow(new Date(answer.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {user && (
                <div className="pt-2">
                  {selectedQuestion === question.id ? (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Write your answer..."
                        value={answerContent}
                        onChange={(e) => setAnswerContent(e.target.value)}
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handlePostAnswer(question.id)}>
                          <Send className="mr-2 h-4 w-4" />
                          Post Answer
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setSelectedQuestion(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setSelectedQuestion(question.id)}>
                      Answer this question
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {questions.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No questions yet. Be the first to ask!</p>
            {user && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Ask First Question</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Ask a Question</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateQuestion} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={newQuestion.category} onValueChange={(value) => setNewQuestion({ ...newQuestion, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="health">Health</SelectItem>
                          <SelectItem value="feeding">Feeding</SelectItem>
                          <SelectItem value="breeding">Breeding</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        placeholder="What's your question?"
                        value={newQuestion.title}
                        onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Details</Label>
                      <Textarea
                        placeholder="Provide more details about your question..."
                        value={newQuestion.content}
                        onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                        rows={4}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">Post Question</Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Forum;
