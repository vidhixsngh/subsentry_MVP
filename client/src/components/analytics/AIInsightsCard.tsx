import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIInsightsCardProps {
  insights: string;
  isLoading: boolean;
  onRefresh: () => void;
}

export default function AIInsightsCard({ insights, isLoading, onRefresh }: AIInsightsCardProps) {
  return (
    <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-emerald-900">AI Insights</CardTitle>
              <CardDescription>Personalized recommendations powered by Gemini</CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="border-emerald-300 hover:bg-emerald-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-4 bg-emerald-100 rounded animate-pulse" />
            <div className="h-4 bg-emerald-100 rounded animate-pulse w-5/6" />
            <div className="h-4 bg-emerald-100 rounded animate-pulse w-4/6" />
            <div className="h-4 bg-emerald-100 rounded animate-pulse w-5/6" />
            <div className="h-4 bg-emerald-100 rounded animate-pulse w-3/6" />
          </div>
        ) : insights ? (
          <div className="prose prose-sm max-w-none prose-headings:text-emerald-900 prose-headings:font-semibold prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-emerald-700 prose-ul:text-gray-700">
            <ReactMarkdown>{insights}</ReactMarkdown>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Sparkles className="w-12 h-12 mx-auto mb-3 text-emerald-300" />
            <p className="text-sm">Click refresh to generate AI insights</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
