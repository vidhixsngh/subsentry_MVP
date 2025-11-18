import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Shield, Lightbulb, Bell, TrendingUp } from "lucide-react";

export default function LoginPage() {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "An error occurred during sign in");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Confident Black Background */}
      <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
        {/* Subtle animated gradient overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-500/5 animate-pulse" 
          style={{ animationDuration: '4s' }}
        />
        
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 sm:py-32">
          {/* Logo */}
          <div className="flex items-center justify-center mb-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">SubSentry</span>
            </div>
          </div>

          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8 tracking-tight">
              Your subscriptions,
              <span className="block mt-2 bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                finally organized
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-300 leading-relaxed mb-12 max-w-3xl mx-auto font-light">
              Stop losing money on forgotten subscriptions. SubSentry automatically tracks all your recurring payments, sends smart reminders, and helps you take back control.
            </p>

            {/* CTA Card */}
            <div className="max-w-md mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 sm:p-10 border border-gray-100">
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 animate-in fade-in slide-in-from-top-2 duration-300">
                  {error}
                </div>
              )}

              <h2 className="text-2xl font-bold text-gray-900 mb-3">Get started free</h2>
              <p className="text-gray-600 mb-8 text-base">Join thousands taking control of their subscriptions</p>
              
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                data-testid="button-google-login"
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md group"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-emerald-500 rounded-full animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              <p className="mt-6 text-xs text-gray-500 leading-relaxed">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>

        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 text-white" preserveAspectRatio="none" viewBox="0 0 1200 120" fill="currentColor">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" />
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" />
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" />
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Everything in one place
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              A calm, organized view of your financial commitments
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {[
              {
                name: 'Smart Detection',
                description: 'Automatically finds subscriptions from your SMS and emails. No manual entry needed.',
                icon: Lightbulb,
              },
              {
                name: 'Timely Reminders',
                description: 'Get notified before renewals and trial expirations. Never get surprised again.',
                icon: Bell,
              },
              {
                name: 'AI Insights',
                description: 'Discover spending patterns and get personalized suggestions to save money.',
                icon: TrendingUp,
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={feature.name} 
                  className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl text-white mb-6 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-base">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Social Proof / Trust Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-3xl p-12 border border-emerald-200/50">
            <p className="text-2xl sm:text-3xl text-gray-800 font-medium leading-relaxed mb-6 italic">
              "I don't mind paying for things — I just want to know what I'm paying for and if it's worth it."
            </p>
            <div className="flex items-center justify-center gap-2 text-emerald-700">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-white" />
                ))}
              </div>
              <span className="text-sm font-medium ml-2">Join 10,000+ users in control</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto py-12 px-6 sm:px-8">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold text-gray-900">SubSentry</span>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} SubSentry. Your financial wellness companion.
          </p>
        </div>
      </footer>
    </div>
  );
}
