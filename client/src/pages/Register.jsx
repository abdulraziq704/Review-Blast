import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const initialPlan = params.get('plan') || 'startup';
    const initialCycle = params.get('cycle') || 'monthly';
    const initialCurrency = params.get('currency') || 'PKR';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        businessName: '',
        plan: initialPlan,
    });
    const [billingCycle, setBillingCycle] = useState(initialCycle);
    const [currency, setCurrency] = useState(initialCurrency);

    const plans = [
        {
            id: 'startup',
            name: 'Startup',
            monthlyPrice: currency === 'PKR' ? 1500 : 15,
            yearlyPrice: currency === 'PKR' ? 15000 : 150,
            contacts: 300,
            color: 'indigo'
        },
        {
            id: 'growth',
            name: 'Growth',
            monthlyPrice: currency === 'PKR' ? 2500 : 25,
            yearlyPrice: currency === 'PKR' ? 25000 : 250,
            contacts: 500,
            color: 'green'
        },
        {
            id: 'business',
            name: 'Business',
            monthlyPrice: currency === 'PKR' ? 4500 : 35,
            yearlyPrice: currency === 'PKR' ? 45000 : 350,
            contacts: 1000,
            color: 'purple'
        },
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePlanSelect = (planId) => {
        setFormData({ ...formData, plan: planId });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await register({ ...formData, billingCycle, currency });
        if (success) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-4xl">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-gray-900">Create your account</h2>
                    <p className="mt-2 text-sm text-gray-600">Join ReviewBlast and start growing your business</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* User Details */}
                    <div className="space-y-5">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Business Details</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Your Name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Business Name</label>
                            <input
                                type="text"
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Your Business"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {/* Plan Selection */}
                    <div className="space-y-5">
                        <div className="flex bg-gray-100 p-1 rounded-xl mb-4 self-start">
                            <button
                                type="button"
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${billingCycle === 'monthly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Monthly
                            </button>
                            <button
                                type="button"
                                onClick={() => setBillingCycle('yearly')}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${billingCycle === 'yearly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Yearly
                            </button>
                            {/* Currency Indicator */}
                            <div className="ml-auto flex items-center gap-2 px-3">
                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{currency}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {plans.map((plan) => (
                                <div
                                    key={plan.id}
                                    onClick={() => handlePlanSelect(plan.id)}
                                    className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-md ${formData.plan === plan.id
                                        ? `border-${plan.color}-500 bg-${plan.color}-50`
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className={`text-[10px] font-bold uppercase tracking-wider text-${plan.color}-600`}>
                                                {plan.name}
                                            </p>
                                            <h4 className="text-xl font-bold text-gray-900 font-outfit">
                                                {currency === 'PKR' ? 'PKR ' : '$'}{billingCycle === 'monthly' ? plan.monthlyPrice.toLocaleString() : plan.yearlyPrice.toLocaleString()}
                                                <span className="text-xs text-gray-400 font-medium lowercase"> / {billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                                            </h4>
                                            <p className="text-xs text-gray-500">{plan.contacts} contacts included</p>
                                        </div>
                                        {formData.plan === plan.id && (
                                            <div className={`bg-${plan.color}-500 text-white rounded-full p-1`}>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition transform hover:-translate-y-1 shadow-lg active:scale-95"
                        >
                            Complete Registration
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-center text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-500">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
