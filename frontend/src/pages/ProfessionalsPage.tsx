import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Star,
  Award,
  Briefcase,
  Mail,
  MessageCircle,
  Filter,
  CheckCircle,
  GraduationCap,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import Badge from '../components/Badge';

interface Professional {
  id: string;
  name: string;
  email: string;
  avatar: string;
  specialization: string;
  credentials: string;
  yearsOfExperience: number;
  bio: string;
  isVerified: boolean;
  badge: 'NONE' | 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  rating: number;
  reviewCount: number;
  availability: string;
  languages: string[];
}

const mockProfessionals: Professional[] = [
  {
    id: '1',
    name: 'Dr. Abebe Kebede',
    email: 'abebe.kebede@example.com',
    avatar: '',
    specialization: 'Clinical Psychology',
    credentials: 'Ph.D. in Clinical Psychology',
    yearsOfExperience: 15,
    bio: 'Specializing in anxiety, depression, and trauma recovery. I believe in a holistic approach to mental wellness.',
    isVerified: true,
    badge: 'GOLD',
    rating: 4.9,
    reviewCount: 128,
    availability: 'Mon-Fri, 9AM-5PM',
    languages: ['English', 'Amharic'],
  },
  {
    id: '2',
    name: 'Dr. Sara Hailu',
    email: 'sara.hailu@example.com',
    avatar: '',
    specialization: 'Counseling Psychology',
    credentials: 'Ph.D. in Counseling',
    yearsOfExperience: 10,
    bio: 'Passionate about helping young adults navigate life transitions and relationship challenges.',
    isVerified: true,
    badge: 'SILVER',
    rating: 4.7,
    reviewCount: 86,
    availability: 'Tue-Sat, 10AM-6PM',
    languages: ['English', 'Amharic', 'Oromiffa'],
  },
  {
    id: '3',
    name: 'Ato Lemma Bekele',
    email: 'lemma.bekele@example.com',
    avatar: '',
    specialization: 'Family Therapy',
    credentials: 'M.A. in Marriage & Family Therapy',
    yearsOfExperience: 8,
    bio: 'Helping families build stronger connections and resolve conflicts in a safe space.',
    isVerified: true,
    badge: 'BRONZE',
    rating: 4.8,
    reviewCount: 64,
    availability: 'Mon, Wed, Fri, 2PM-8PM',
    languages: ['Amharic', 'Oromiffa'],
  },
];

const badgeColors = {
  NONE: 'bg-gray-100 text-gray-600',
  BRONZE: 'bg-amber-100 text-amber-700',
  SILVER: 'bg-slate-100 text-slate-700',
  GOLD: 'bg-yellow-100 text-yellow-700',
  PLATINUM: 'bg-purple-100 text-purple-700',
};

const ProfessionalsPage = () => {
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState<Professional[]>(mockProfessionals);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const filteredProfessionals = professionals.filter((pro) => {
    const matchesSearch = pro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pro.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpec = selectedSpecialization === 'All' || pro.specialization === selectedSpecialization;
    return matchesSearch && matchesSpec;
  });

  const specializations = ['All', ...new Set(professionals.map(p => p.specialization))];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">Mental Health Professionals</h1>
          <p className="text-sm text-slate-600">
            Connect with verified professionals for support
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search by name or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              {specializations.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Professionals Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse border border-slate-100">
              <div className="h-20 bg-slate-200 rounded-xl mb-4" />
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredProfessionals.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfessionals.map((pro) => (
            <div 
              key={pro.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xl font-bold">
                  {pro.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 truncate">{pro.name}</h3>
                    {pro.isVerified && (
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-slate-500">{pro.specialization}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-medium text-slate-700">{pro.rating}</span>
                    <span className="text-sm text-slate-400">({pro.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Badge */}
              <Badge 
                variant="primary" 
                size="sm"
                className={`mb-3 ${badgeColors[pro.badge]}`}
              >
                <Award className="w-3 h-3 mr-1" />
                {pro.badge} Professional
              </Badge>

              {/* Details */}
              <div className="space-y-2 text-sm text-slate-600 mb-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-slate-400" />
                  <span className="truncate">{pro.credentials}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  <span>{pro.yearsOfExperience} years experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{pro.availability}</span>
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                {pro.bio}
              </p>

              {/* Languages */}
              <div className="flex flex-wrap gap-1 mb-4">
                {pro.languages.map((lang) => (
                  <span 
                    key={lang}
                    className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full"
                  >
                    {lang}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="flex-1"
                  leftIcon={<Mail className="w-4 h-4" />}
                >
                  Email
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1"
                  leftIcon={<MessageCircle className="w-4 h-4" />}
                >
                  Message
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No professionals found</h3>
          <p className="text-slate-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default ProfessionalsPage;
