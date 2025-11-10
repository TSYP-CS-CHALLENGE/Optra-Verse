import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Phone, IdCard, Briefcase, Search, Building, AlertCircle, Languages, ChevronDown } from "lucide-react";
import logo from "../assets/images/logo.png";
import InstallPrompt from "@/components/ui/utils/InstallPrompt";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { LanguageContext, useTranslation } from '@/i18n';

export default function HomeScreen() {
    const [showLogin, setShowLogin] = useState(true);
    const { t } = useTranslation();
    const { language: currentLanguage, setLanguage } = useContext(LanguageContext);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const { theme, setTheme } = useTheme();
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [selectedRole, setSelectedRole] = useState<'jobseeker' | 'recruiter' | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        prenom: '',
        email: '',
        password: '',
        cin: '',
        phone: '',
        address: '',
        company: '',
        position: '',
        resume: null as File | null,
        companyLogo: null as File | null,
        website: '',
        industry: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [backendError, setBackendError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const changeLanguage = (lng: string) => {
        setLanguage(lng);
        setShowLanguageDropdown(false);
    };

    useEffect(() => {
        setIsLoaded(true);
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const languages = [
        { value: 'fr', label: 'Français', flag: '🇫🇷' },
        { value: 'en', label: 'English', flag: '🇺🇸' },
        { value: 'ar', label: 'العربية', flag: '🇸🇦' }
    ];

    const currentLanguageInfo = languages.find(lang => lang.value === currentLanguage) || languages[0];



    if (!mounted) {
        return (
            <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string) => {
        const phoneRegex = /^[0-9]{8}$/;
        return phoneRegex.test(phone);
    };

    const validateCIN = (cin: string) => {
        return cin.length >= 6;
    };

    const validateRequired = (value: string) => {
        return value.trim().length > 0;
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
        if (backendError) {
            setBackendError('');
        }
    };

    const handleFileChange = (field: string, file: File | null) => {
        setFormData(prev => ({ ...prev, [field]: file }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateLoginForm = () => {
        const newErrors: Record<string, string> = {};

        if (!validateRequired(formData.email)) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!validateRequired(formData.password)) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateRegistrationForm = () => {
        const newErrors: Record<string, string> = {};

        if (!validateRequired(formData.name)) newErrors.name = 'First name is required';
        if (!validateRequired(formData.prenom)) newErrors.prenom = 'Last name is required';
        if (!validateRequired(formData.email)) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!validateRequired(formData.password)) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (!validateRequired(formData.phone)) {
            newErrors.phone = 'Phone number is required';
        } else if (!validatePhone(formData.phone)) {
            newErrors.phone = 'Please enter a valid 8-digit phone number';
        }

        if (selectedRole === 'jobseeker') {
            if (!validateRequired(formData.cin)) {
                newErrors.cin = 'CIN is required';
            } else if (!validateCIN(formData.cin)) {
                newErrors.cin = 'CIN must be at least 6 characters';
            }
            if (!formData.resume) {
                newErrors.resume = 'Resume is required';
            }
        }

        if (selectedRole === 'recruiter') {
            if (!validateRequired(formData.company)) newErrors.company = 'Company name is required';
            if (!validateRequired(formData.position)) newErrors.position = 'Your position is required';
            if (!validateRequired(formData.industry)) newErrors.industry = 'Industry is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setBackendError('');

        if (validateLoginForm()) {
            setLoading(true);
            try {
                console.log("Login logic here");
                // Add your login API call here
            } catch (error: any) {
                console.error('Login error:', error);
                if (error.response) {
                    const errorMessage = error.response.data?.message ||
                        error.response.data?.error ||
                        'Login error';
                    setBackendError(errorMessage);

                    if (error.response.data?.errors) {
                        const fieldErrors = error.response.data.errors;
                        setErrors(fieldErrors);
                    }
                } else if (error.request) {
                    setBackendError('Network error. Please check your connection.');
                } else {
                    setBackendError('An unexpected error occurred.');
                }
            } finally {
                setLoading(false);
            }
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setBackendError('');

        if (validateRegistrationForm()) {
            setLoading(true);
            try {
                const userRegister = new FormData();
                userRegister.append('name', formData.name);
                userRegister.append('prenom', formData.prenom);
                userRegister.append('email', formData.email);
                userRegister.append('password', formData.password);
                userRegister.append('role', selectedRole || '');
                userRegister.append('phone', formData.phone);

                if (selectedRole === 'jobseeker') {
                    userRegister.append('cin', formData.cin);
                    if (formData.resume) {
                        userRegister.append('resume', formData.resume);
                    }
                }

                if (selectedRole === 'recruiter') {
                    userRegister.append('company', formData.company);
                    userRegister.append('position', formData.position);
                    userRegister.append('industry', formData.industry);
                    userRegister.append('website', formData.website);
                    if (formData.companyLogo) {
                        userRegister.append('company_logo', formData.companyLogo);
                    }
                }

                console.log("Registration logic here");
                // Add your registration API call here

            } catch (error: any) {
                console.error('Registration error:', error);
                if (error.response) {
                    const errorData = error.response.data;
                    const errorMessage = errorData?.message ||
                        errorData?.error ||
                        "Registration error";
                    setBackendError(errorMessage);

                    if (errorData.errors) {
                        const fieldErrors: Record<string, string> = {};
                        Object.keys(errorData.errors).forEach(field => {
                            const fieldName = field === 'company_logo' ? 'companyLogo' : field;
                            fieldErrors[fieldName] = errorData.errors[field][0];
                        });
                        setErrors(fieldErrors);
                    }

                    if (errorMessage.includes('email') || errorMessage.includes('Email')) {
                        setErrors(prev => ({ ...prev, email: 'This email is already used' }));
                    }
                    if (errorMessage.includes('cin') || errorMessage.includes('CIN')) {
                        setErrors(prev => ({ ...prev, cin: 'This CIN is already used' }));
                    }

                } else if (error.request) {
                    setBackendError('Network error. Please check your connection.');
                } else {
                    setBackendError("An unexpected error occurred during registration.");
                }
            } finally {
                setLoading(false);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            prenom: '',
            email: '',
            password: '',
            cin: '',
            phone: '',
            address: '',
            company: '',
            position: '',
            resume: null,
            companyLogo: null,
            website: '',
            industry: '',
        });
        setErrors({});
        setBackendError('');
        setSelectedRole(null);
    };

    return (
        <div className="min-h-screen bg-gradient-hero flex flex-col relative overflow-hidden transition-colors duration-300">
            <InstallPrompt />
            <div className="fixed flex  top-2 right-5 items-center gap-2 z-20">
                <div className="relative">
                    <button
                        onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                        className="flex items-center gap-1 px-2 py-1 bg-background/80 backdrop-blur-lg border border-border/50 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
                    >
                        <Languages className="w-3 h-3 text-primary" />
                        <span className="font-medium text-foreground">
                            {currentLanguageInfo.value.toUpperCase()}
                        </span>
                        <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform duration-200 ${showLanguageDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showLanguageDropdown && (
                        <div className="absolute top-full mt-1 right-0 bg-background/95 backdrop-blur-lg border border-border/50 rounded-md shadow-xl py-1 z-50 min-w-[50px]">
                            {languages.map((language) => (
                                <button
                                    key={language.value}
                                    onClick={() => changeLanguage(language.value)}
                                    className={`flex items-center justify-center w-full px-2 py-1 transition-colors duration-150 text-sm ${currentLanguage === language.value
                                        ? 'bg-primary/20 text-primary font-medium'
                                        : 'text-foreground hover:bg-accent/50'
                                        }`}
                                >
                                    {language.value.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <Button
                    size="icon"
                    onClick={toggleTheme}
                    className="w-8 h-8 bg-white/90 backdrop-blur-lg border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 dark:bg-background/80 dark:border-border/50"
                >
                    {theme === "dark" ? <Sun size={16} className="text-amber-500" /> : <Moon size={16} className="text-slate-600" />}
                </Button>
            </div>

            <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
                <div className={`w-full max-w-md transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    <div className="text-center mb-12">
                        <div className="relative mb-6">
                            <div className="logo-container w-24 h-24 mx-auto rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 hover:scale-105">
                                <img
                                    src={logo}
                                    alt="CareerHub Logo"
                                    className="logo-img w-20 h-20 object-contain"
                                />
                            </div>
                        </div>
                        <h1 className="app-title text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-3">
                            {t('apiErrors.401')}<span className="font-light">Hub</span>
                        </h1>
                        <p className="app-subtitle text-lg font-light">
                            Find your dream job or perfect candidate
                        </p>
                    </div>
                    <div className="form-container card-glass rounded-xl shadow-xl border text-center p-6 transition-colors duration-300">
                        <div className="toggle-container rounded-2xl p-1.5 mb-8 transition-colors duration-300">
                            <button
                                onClick={() => { setShowLogin(true); resetForm(); }}
                                className={`toggle-btn flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${showLogin
                                    ? 'toggle-btn-active shadow-sm'
                                    : 'toggle-btn-inactive'
                                    }`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => { setShowLogin(false); resetForm(); }}
                                className={`toggle-btn flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${!showLogin
                                    ? 'toggle-btn-active shadow-sm'
                                    : 'toggle-btn-inactive'
                                    }`}
                            >
                                Register
                            </button>
                        </div>
                        {backendError && (
                            <div className={`alert-message mb-6 p-4 rounded-xl flex items-center space-x-3 ${backendError.includes('success')
                                ? 'alert-success'
                                : 'alert-error'
                                }`}>
                                <AlertCircle className="alert-icon w-5 h-5 shrink-0" />
                                <p className="alert-text text-sm font-medium">{backendError}</p>
                            </div>
                        )}
                        {showLogin ? (
                            <form onSubmit={handleLogin} className="space-y-5">
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            className={`input-field w-full pl-12 pr-4 py-4 rounded-2xl transition-all duration-300 ${errors.email
                                                ? 'input-error'
                                                : 'input-normal'
                                                }`}
                                        />
                                        {errors.email && (
                                            <p className="error-text text-red-500 text-sm mt-1">{errors.email}</p>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                            className={`input-field w-full pl-12 pr-12 py-4 rounded-2xl transition-all duration-300 ${errors.password
                                                ? 'input-error'
                                                : 'input-normal'
                                                }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="password-toggle-btn absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                        {errors.password && (
                                            <p className="error-text text-red-500 text-sm mt-1">{errors.password}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Forgot Password */}
                                <div className="text-right">
                                    <button type="button" className="forgot-password-btn text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                                        Forgot password?
                                    </button>
                                </div>

                                {/* Login Button */}
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="login-btn w-full bg-gradient-primary text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            <span>Signing in...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <span>Sign In</span>
                                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        ) : (
                            /* Registration Flow */
                            <div className="space-y-6">
                                {/* Role Selection */}
                                {!selectedRole ? (
                                    <div className="space-y-4">
                                        <h3 className="role-title text-lg font-semibold text-center mb-4 text-foreground">Choose Your Role</h3>
                                        <div className="grid grid-cols-1 gap-4">
                                            <button
                                                onClick={() => setSelectedRole('jobseeker')}
                                                className="role-btn jobseeker-btn p-4 border-2 rounded-2xl transition-all duration-300 text-left hover:scale-105 border-orange-200 hover:border-orange-400 hover:bg-orange-50 dark:border-orange-600 dark:hover:border-orange-400 dark:hover:bg-orange-900/20"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Search className="role-icon jobseeker-icon w-8 h-8 text-orange-600 dark:text-orange-400" />
                                                    <div>
                                                        <h4 className="role-name font-semibold text-foreground">Job Seeker</h4>
                                                        <p className="role-description text-muted-foreground">Find your dream job and apply</p>
                                                    </div>
                                                </div>
                                            </button>
                                            <button
                                                onClick={() => setSelectedRole('recruiter')}
                                                className="role-btn recruiter-btn p-4 border-2 rounded-2xl transition-all duration-300 text-left hover:scale-105 border-blue-200 hover:border-blue-400 hover:bg-blue-50 dark:border-blue-600 dark:hover:border-blue-400 dark:hover:bg-blue-900/20"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Building className="role-icon recruiter-icon w-8 h-8 text-blue-600 dark:text-blue-400" />
                                                    <div>
                                                        <h4 className="role-name font-semibold text-foreground">Recruiter</h4>
                                                        <p className="role-description text-muted-foreground">Post jobs and find talent</p>
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* Registration Form */
                                    <form onSubmit={handleRegister} className="space-y-4">
                                        <div className="flex items-center gap-2 mb-4">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedRole(null)}
                                                className="back-btn text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                <ArrowRight className="w-5 h-5 transform rotate-180" />
                                            </button>
                                            <span className="role-indicator text-sm font-medium capitalize text-muted-foreground">{selectedRole} Registration</span>
                                        </div>

                                        {/* Common Fields */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="First Name"
                                                    value={formData.name}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                    className={`input-field w-full px-4 py-3 rounded-xl transition-all duration-300 ${errors.name
                                                        ? 'input-error'
                                                        : 'input-normal'
                                                        }`}
                                                />
                                                {errors.name && <p className="error-text text-red-500 text-sm mt-1">{errors.name}</p>}
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Last Name"
                                                    value={formData.prenom}
                                                    onChange={(e) => handleInputChange('prenom', e.target.value)}
                                                    className={`input-field w-full px-4 py-3 rounded-xl transition-all duration-300 ${errors.prenom
                                                        ? 'input-error'
                                                        : 'input-normal'
                                                        }`}
                                                />
                                                {errors.prenom && <p className="error-text text-red-500 text-sm mt-1">{errors.prenom}</p>}
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <input
                                                type="email"
                                                placeholder="Email address"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                className={`input-field w-full pl-12 pr-4 py-3 rounded-xl transition-all duration-300 ${errors.email
                                                    ? 'input-error'
                                                    : 'input-normal'
                                                    }`}
                                            />
                                            {errors.email && <p className="error-text text-red-500 text-sm mt-1">{errors.email}</p>}
                                        </div>

                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Create password"
                                                value={formData.password}
                                                onChange={(e) => handleInputChange('password', e.target.value)}
                                                className={`input-field w-full pl-12 pr-12 py-3 rounded-xl transition-all duration-300 ${errors.password
                                                    ? 'input-error'
                                                    : 'input-normal'
                                                    }`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="password-toggle-btn absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                            {errors.password && <p className="error-text text-red-500 text-sm mt-1">{errors.password}</p>}
                                        </div>

                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <input
                                                type="tel"
                                                placeholder="Phone Number"
                                                value={formData.phone}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                className={`input-field w-full pl-12 pr-4 py-3 rounded-xl transition-all duration-300 ${errors.phone
                                                    ? 'input-error'
                                                    : 'input-normal'
                                                    }`}
                                            />
                                            {errors.phone && <p className="error-text text-red-500 text-sm mt-1">{errors.phone}</p>}
                                        </div>

                                        {/* Job Seeker Specific Fields */}
                                        {selectedRole === 'jobseeker' && (
                                            <>
                                                <div className="relative">
                                                    <IdCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                    <input
                                                        type="text"
                                                        placeholder="CIN"
                                                        value={formData.cin}
                                                        onChange={(e) => handleInputChange('cin', e.target.value)}
                                                        className={`input-field w-full pl-12 pr-4 py-3 rounded-xl transition-all duration-300 ${errors.cin
                                                            ? 'input-error'
                                                            : 'input-normal'
                                                            }`}
                                                    />
                                                    {errors.cin && <p className="error-text text-red-500 text-sm mt-1">{errors.cin}</p>}
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="file-label text-sm font-medium text-foreground">Resume *</label>
                                                    <label className="file-upload-area flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors border-border hover:border-primary bg-background/50">
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept=".pdf,.doc,.docx"
                                                            onChange={(e) => handleFileChange('resume', e.target.files?.[0] || null)}
                                                        />
                                                        <Briefcase className="file-icon w-8 h-8 mb-2 text-muted-foreground" />
                                                        <span className="file-text text-sm text-muted-foreground">Upload your resume (PDF, DOC, DOCX)</span>
                                                        {formData.resume && (
                                                            <span className="file-name text-xs mt-1 text-primary">{formData.resume.name}</span>
                                                        )}
                                                    </label>
                                                    {errors.resume && <p className="error-text text-red-500 text-sm mt-1">{errors.resume}</p>}
                                                </div>
                                            </>
                                        )}

                                        {/* Recruiter Specific Fields */}
                                        {selectedRole === 'recruiter' && (
                                            <>
                                                <div className="relative">
                                                    <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                    <input
                                                        type="text"
                                                        placeholder="Company Name"
                                                        value={formData.company}
                                                        onChange={(e) => handleInputChange('company', e.target.value)}
                                                        className={`input-field w-full pl-12 pr-4 py-3 rounded-xl transition-all duration-300 ${errors.company
                                                            ? 'input-error'
                                                            : 'input-normal'
                                                            }`}
                                                    />
                                                    {errors.company && <p className="error-text text-red-500 text-sm mt-1">{errors.company}</p>}
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <input
                                                            type="text"
                                                            placeholder="Your Position"
                                                            value={formData.position}
                                                            onChange={(e) => handleInputChange('position', e.target.value)}
                                                            className={`input-field w-full px-4 py-3 rounded-xl transition-all duration-300 ${errors.position
                                                                ? 'input-error'
                                                                : 'input-normal'
                                                                }`}
                                                        />
                                                        {errors.position && <p className="error-text text-red-500 text-sm mt-1">{errors.position}</p>}
                                                    </div>
                                                    <div>
                                                        <input
                                                            type="text"
                                                            placeholder="Industry"
                                                            value={formData.industry}
                                                            onChange={(e) => handleInputChange('industry', e.target.value)}
                                                            className={`input-field w-full px-4 py-3 rounded-xl transition-all duration-300 ${errors.industry
                                                                ? 'input-error'
                                                                : 'input-normal'
                                                                }`}
                                                        />
                                                        {errors.industry && <p className="error-text text-red-500 text-sm mt-1">{errors.industry}</p>}
                                                    </div>
                                                </div>

                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                    <input
                                                        type="url"
                                                        placeholder="Company Website (optional)"
                                                        value={formData.website}
                                                        onChange={(e) => handleInputChange('website', e.target.value)}
                                                        className="input-field w-full pl-12 pr-4 py-3 rounded-xl transition-all duration-300 input-normal"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="file-label text-sm font-medium text-foreground">Company Logo (optional)</label>
                                                    <label className="file-upload-area flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors border-border hover:border-primary bg-background/50">
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept=".jpg,.jpeg,.png"
                                                            onChange={(e) => handleFileChange('companyLogo', e.target.files?.[0] || null)}
                                                        />
                                                        <Building className="file-icon w-6 h-6 mb-1 text-muted-foreground" />
                                                        <span className="file-text text-xs text-muted-foreground">Upload company logo</span>
                                                        {formData.companyLogo && (
                                                            <span className="file-name text-xs mt-1 text-primary">{formData.companyLogo.name}</span>
                                                        )}
                                                    </label>
                                                </div>
                                            </>
                                        )}

                                        {/* Terms Agreement */}
                                        <div className="terms-agreement text-center text-sm text-muted-foreground">
                                            By registering, you agree to our{" "}
                                            <button type="button" className="terms-link font-medium text-primary hover:text-primary/80 transition-colors">
                                                Terms
                                            </button>{" "}
                                            and{" "}
                                            <button type="button" className="terms-link font-medium text-primary hover:text-primary/80 transition-colors">
                                                Privacy Policy
                                            </button>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="register-btn w-full bg-gradient-primary text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <div className="flex items-center justify-center">
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                    <span>Registering...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <span>Create {selectedRole} Account</span>
                                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="text-center mt-8">
                        <p className="auth-switch-text text-sm text-muted-foreground">
                            {showLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => { setShowLogin(!showLogin); resetForm(); }}
                                className="auth-switch-btn font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                                {showLogin ? "Sign up" : "Sign in"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}