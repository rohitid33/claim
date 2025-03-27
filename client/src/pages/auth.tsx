import { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuthContext } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { MigrationWarning } from "@/components/MigrationWarning";

const usernameSchema = z.object({
  username: z.string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .transform(val => val.replace(/\D/g, '')) // Remove any non-digits
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits").regex(/^\d+$/, "OTP must contain only numbers"),
});

const passwordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type UsernameFormData = z.infer<typeof usernameSchema>;
type OTPFormData = z.infer<typeof otpSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const RESEND_COOLDOWN = 30; // 30 seconds cooldown

interface MigrationStatus {
  startedAt: string;
  daysRemaining: number | null;
  remindersSent: number;
  lastReminder: string | null;
  scheduledDeletionDate: string;
}

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Life Insurance Claim",
    content: "Claimsutra helped me get my life insurance claim settled within weeks.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
  },
  {
    name: "Michael Chen",
    role: "Health Insurance Dispute",
    content: "Professional team that guided me through the entire resolution process.",
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f",
  },
  {
    name: "Emily Brown",
    role: "Policy Review",
    content: "Their expert analysis saved me from a potential claim rejection.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978",
  },
];

export default function AuthPage() {
  const [_, setLocation] = useLocation();
  const { user, requestOTPMutation, verifyOTPMutation, loginWithPasswordMutation } = useAuthContext();
  const [userId, setUserId] = useState<string | null>(null);
  const [otpValue, setOtpValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [username, setUsername] = useState("");
  const [authMethod] = useState<"otp">("otp");
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus | null>(null);

  useEffect(() => {
    if (user) {
      // Get returnUrl from query parameters
      const params = new URLSearchParams(window.location.search);
      const returnUrl = params.get('returnUrl');
      // Redirect to returnUrl if present, otherwise go to home
      setLocation(returnUrl || "/");
    }
  }, [user, setLocation]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const startResendTimer = useCallback(() => {
    setResendTimer(RESEND_COOLDOWN);
  }, []);

  const handleResendOTP = async () => {
    if (resendTimer > 0 || !username) return;
    
    setError(null);
    try {
      const result = await requestOTPMutation.mutateAsync({ username });
      setUserId(result.userId);
      startResendTimer();
    } catch (error) {
      console.error("Failed to resend OTP:", error);
      setError(error instanceof Error ? error.message : "Failed to resend OTP");
    }
  };

  const usernameForm = useForm<UsernameFormData>({
    resolver: zodResolver(usernameSchema),
  });

  const otpForm = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: ''
    }
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const handleUsernameSubmit = async (data: UsernameFormData) => {
    setError(null);
    // Add +91 prefix to the phone number
    const phoneWithPrefix = `+91${data.username}`;
    setUsername(phoneWithPrefix);
    
    if (authMethod === "otp") {
      try {
        const result = await requestOTPMutation.mutateAsync({ 
          username: phoneWithPrefix 
        });
        setUserId(result.userId);
        startResendTimer();
      } catch (error) {
        console.error("Failed to request OTP:", error);
        setError(error instanceof Error ? error.message : "Failed to request OTP");
        usernameForm.setError("username", { message: "Failed to send OTP" });
      }
    } else {
      setUserId("password");
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setOtpValue(value);
    otpForm.setValue('otp', value);
  };

  const handleOTPSubmit = async (data: OTPFormData) => {
    if (!userId) return;
    setError(null);
    try {
      await verifyOTPMutation.mutateAsync({
        userId,
        otp: data.otp,
      });
    } catch (error) {
      console.error("Failed to verify OTP:", error);
      setError(error instanceof Error ? error.message : "Failed to verify OTP");
      otpForm.setError("otp", { message: "Invalid OTP" });
    }
  };

  const handlePasswordSubmit = async (data: PasswordFormData) => {
    setError(null);
    try {
      const response = await loginWithPasswordMutation.mutateAsync({
        username,
        password: data.password,
      });
      
      // Check for migration status in response
      if (response.migrationStatus) {
        setMigrationStatus(response.migrationStatus);
      }
    } catch (error) {
      console.error("Failed to login:", error);
      setError(error instanceof Error ? error.message : "Failed to login");
      passwordForm.setError("password", { message: "Invalid credentials" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-4 md:py-8 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 md:mb-6">
            What Our Clients Say
          </h2>
          
          <div className="relative max-w-5xl mx-auto overflow-hidden scroll-container mb-4 md:mb-6">
            {/* Testimonials container with continuous CSS animation */}
            <div 
              className="flex gap-6 animate-scroll"
              style={{ 
                willChange: 'transform',
                width: `${testimonials.length * (320 + 24) * 2}px` // Double width for the duplicated set
              }}
            >
              {/* First set of testimonials */}
              {testimonials.map((testimonial, index) => (
                <Card key={`first-${index}`} className="flex-shrink-0 w-80 border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={testimonial.image} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm text-gray-600 mb-3">{testimonial.content}</p>
                        <h3 className="font-medium text-sm text-gray-900">{testimonial.name}</h3>
                        <p className="text-xs text-primary">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Duplicate set for seamless scrolling */}
              {testimonials.map((testimonial, index) => (
                <Card key={`second-${index}`} className="flex-shrink-0 w-80 border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={testimonial.image} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm text-gray-600 mb-3">{testimonial.content}</p>
                        <h3 className="font-medium text-sm text-gray-900">{testimonial.name}</h3>
                        <p className="text-xs text-primary">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Add gradient overlays for better visual effect */}
            <div className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none"></div>
            <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-md px-4 pb-8 -mt-4 md:-mt-8">
        <Card className="border border-gray-300 shadow-lg">
          <CardHeader className="space-y-1 border-b border-gray-200 text-center">
            <CardTitle className="text-2xl font-bold">
              India's Legal Claim Expert!
            </CardTitle>
            <CardDescription className="text-base">
              Login in or Sign up
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            {userId === "password" && migrationStatus && (
              <MigrationWarning 
                migrationStatus={migrationStatus}
                onSwitchToOTP={() => {
                  setUserId(null);
                }}
              />
            )}
            {!userId ? (
              <Form {...usernameForm}>
                <form
                  onSubmit={usernameForm.handleSubmit(handleUsernameSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={usernameForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Phone Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none bg-gray-100 border-r rounded-l-md">
                              <span className="text-gray-500 text-sm font-medium">+91</span>
                            </div>
                            <Input
                              {...field}
                              className="pl-14"
                              type="tel"
                              maxLength={10}
                              placeholder="Enter 10 digit mobile number"
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                field.onChange(value);
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={requestOTPMutation.isPending}
                  >
                    {requestOTPMutation.isPending ? "Sending..." : "Continue"}
                  </Button>
                </form>
              </Form>
            ) : userId === "password" ? (
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={passwordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password"
                            className="border border-gray-300 rounded-lg h-12 text-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400"
                            disabled={loginWithPasswordMutation.isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-3">
                    <Button
                      type="submit"
                      className="w-full border border-gray-300 rounded-lg h-12 text-lg font-semibold hover:bg-gray-100"
                      disabled={loginWithPasswordMutation.isPending}
                    >
                      {loginWithPasswordMutation.isPending ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                          Logging in...
                        </div>
                      ) : (
                        "Login"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setUserId(null);
                        setError(null);
                        passwordForm.reset();
                      }}
                      disabled={loginWithPasswordMutation.isPending}
                    >
                      Back to Username
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <Form {...otpForm}>
                <form
                  onSubmit={otpForm.handleSubmit(handleOTPSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Enter OTP</FormLabel>
                        <FormControl>
                          <Input 
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={6}
                            placeholder="Enter 6-digit OTP"
                            className="border border-gray-300 rounded-lg h-12 text-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 text-center tracking-widest"
                            value={otpValue}
                            onChange={handleOtpChange}
                            onFocus={(e) => e.target.select()}
                            disabled={verifyOTPMutation.isPending}
                          />
                        </FormControl>
                        <FormMessage />
                        {resendTimer > 0 ? (
                          <p className="text-sm text-gray-500 mt-2">
                            Resend OTP in {resendTimer} seconds
                          </p>
                        ) : (
                          <button
                            type="button"
                            onClick={handleResendOTP}
                            className="text-sm text-blue-600 hover:text-blue-800 mt-2"
                            disabled={requestOTPMutation.isPending}
                          >
                            Resend OTP
                          </button>
                        )}
                      </FormItem>
                    )}
                  />
                  <div className="space-y-3">
                    <Button
                      type="submit"
                      className="w-full border border-gray-300 rounded-lg h-12 text-lg font-semibold hover:bg-gray-100"
                      disabled={verifyOTPMutation.isPending}
                    >
                      {verifyOTPMutation.isPending ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                          Verifying...
                        </div>
                      ) : (
                        "Verify OTP"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setUserId(null);
                        setOtpValue("");
                        setError(null);
                        setResendTimer(0);
                        otpForm.reset();
                      }}
                      disabled={verifyOTPMutation.isPending}
                    >
                      Back to Username
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
