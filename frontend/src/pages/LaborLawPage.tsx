import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, X, Scale, Languages } from 'lucide-react';

// Bangladesh Labour Act 2006 - Complete Data
const labourActData = [
  {
    chapter: 1,
    title: 'Preliminary (প্রারম্ভিক)',
    sections: [
      {
        no: 1,
        title: 'Short title, extent and commencement (সংক্ষিপ্ত শিরোনাম, প্রবর্তন এবং প্রয়োগ)',
        text: 'This Act may be called the Bangladesh Labour Act, 2006. It extends to the whole of Bangladesh and shall come into force immediately. This Act shall apply to the whole of Bangladesh unless otherwise specified. Certain establishments and workers are excluded from the provisions of this Act, including government offices, security printing presses, ordnance factories, educational and training institutions not operated for profit, and establishments managed by families without employing workers for wages.'
      },
      {
        no: 2,
        title: 'Definitions (সংজ্ঞাসমূহ)',
        text: 'In this Act, unless there is anything repugnant in the subject or context: "adolescent" means a person who has completed fourteenth year but has not completed eighteenth year of age; "adult" means a person who has completed eighteenth year of age; "child" means a person who has not completed fourteenth year of age; "establishment" means any office, court, factory, shop and other trade or industrial establishments; "worker" means any person including apprentices employed directly or through a contractor in any skilled, unskilled, manual, technical, trade promotional or clerical work for hire or reward, whether the terms of employment are express or implied; "employer" means a person who employs workers in an establishment and includes directors, managers, secretaries, agents or any person concerned with the management; "wage" means all remuneration expressed in money which would be payable to a worker on fulfillment of the terms of employment; "factory" means any premises where five or more workers are working and where a manufacturing process is being carried on; "industrial establishment" means any establishment in which any industry, trade, business, manufacture or occupation is carried on; "gratuity" means at the rate of 30 days wages for every completed year of service, or for any part thereof exceeding six months based on the last drawn wages, or 45 days wages for service exceeding 10 years.'
      },
      {
        no: 3,
        title: 'Terms and conditions of service (চাকুরীর শর্তাবলী)',
        text: 'Every establishment shall maintain employment and service conditions according to this Chapter. However, an establishment may have its own service rules, provided such rules are not less favorable than the provisions of this Chapter. Service rules must be submitted to the Chief Inspector for approval within 120 days, and cannot be implemented without such approval. The government may make necessary orders if the Chief Inspector fails to provide orders within the specified time. These provisions do not apply to establishments owned, managed or controlled by the government.'
      },
      {
        no: 4,
        title: 'Classification of workers and apprenticeship period (শ্রমিকগণের শ্রেণী বিভাগ এবং শিক্ষানবিশীকাল)',
        text: 'Workers in any establishment may be classified based on the nature and type of work into: (a) apprentice; (b) substitute; (c) temporary; (d) casual; (e) probationary; (f) permanent; and (g) seasonal workers. The apprenticeship period for clerical work is six months and for other workers is three months. For skilled workers, the apprenticeship period may be extended by another three months if their work quality could not be determined in the first three months. Upon completion of the apprenticeship period, workers shall be considered permanent even if a confirmation letter is not issued.'
      },
      {
        no: 5,
        title: 'Appointment letter and identity card (নিয়োগপত্র ও পরিচয়পত্র)',
        text: 'No employer shall employ any worker without issuing an appointment letter, and every employed worker must be provided with an identity card with photograph.'
      },
    ]
  },
  {
    chapter: 2,
    title: 'Employment of Labour (শ্রমিক নিয়োগ)',
    sections: [
      {
        no: 3,
        title: 'Application of Chapter',
        text: 'The provisions of this Chapter shall apply to every establishment engaged in commercial or industrial undertaking.'
      },
      {
        no: 4,
        title: 'Appointment letter and identity card',
        text: 'Every worker employed on a permanent basis shall be given by the employer, within four months of his employment, an appointment letter and an identity card free of cost.'
      },
      {
        no: 20,
        title: 'Retrenchment (ছাঁটাই)',
        text: 'A worker may be retrenched from an establishment due to surplus requirement. If a worker has been employed continuously for at least one year under an employer, in case of retrenchment the employer must: (a) give one month\'s written notice stating the reason for retrenchment, or pay wages in lieu of the notice period; (b) send a copy of the notice to the Chief Inspector or an officer designated by him, and another copy to the Collective Bargaining Agent (CBA) of the establishment, if any; and (c) pay compensation at the rate of 30 days\' wages for every completed year of service or gratuity, if payable, whichever is higher.'
      },
      {
        no: 21,
        title: 'Re-employment of retrenched worker (ছাঁটাইকৃত শ্রমিকের পুনঃনিয়োগ)',
        text: 'Where any worker is retrenched and within one year of the retrenchment the employer wishes to employ additional workers, the employer shall send a notice to the last known address of the retrenched worker inviting him to apply for employment. Priority shall be given to retrenched workers who apply for re-employment, and if there are multiple retrenched applicants, priority shall be based on their seniority in previous service.'
      },
      {
        no: 22,
        title: 'Discharge from service (চাকুরী হইতে ডিসচার্জ)',
        text: 'A worker may be discharged from service on grounds of physical or mental incapacity or continued ill-health certified by a registered medical practitioner. A discharged worker who has completed at least one year of continuous service shall be paid compensation by the employer at the rate of 30 days\' wages for every completed year of service or gratuity, if payable, whichever is higher.'
      },
      {
        no: 23,
        title: 'Misconduct and punishment (অসদাচরণ এবং দণ্ড-প্রাপ্তির ক্ষেত্রে শাস্তি)',
        text: 'Notwithstanding anything contained elsewhere in this Act regarding lay-off, retrenchment, discharge and termination of service, a worker may be dismissed from service without notice or without wages in lieu of notice if he: (a) is convicted of a criminal offense; or (b) is found guilty of misconduct under Section 24. Instead of dismissal, considering special circumstances, any of the following punishments may be imposed: (a) removal; (b) reduction to a lower post, grade or pay scale for a maximum of one year; (c) stoppage of increment for a maximum of one year; (d) stoppage of promotion for a maximum of one year; (e) fine; (f) suspension without wages or allowances for a maximum of seven days; (g) reprimand and warning.'
      },
      {
        no: 24,
        title: 'Procedure for punishment (শাস্তির পদ্ধতি)',
        text: 'No punishment shall be imposed on a worker under Section 23 unless: (a) a written charge is made against him; (b) a copy of the charge is given to him and he is given at least seven days to reply; (c) he is given an opportunity of being heard; (d) he is found guilty after an inquiry by an inquiry committee consisting of equal number of representatives of the employer and workers, provided such inquiry must be completed within sixty days; (e) the order of dismissal is approved by the employer or manager.'
      },
      {
        no: 26,
        title: 'Notice of dismissal',
        text: 'No employer shall dismiss, discharge, remove from employment or terminate the services of a permanent worker, otherwise than by giving him in writing, one hundred and twenty days notice if he is a monthly rated worker, and sixty days notice if he is otherwise rated.'
      },
    ]
  },
  {
    chapter: 4,
    title: 'Maternity Benefit (প্রসূতি কল্যাণ সুবিধা)',
    sections: [
      {
        no: 46,
        title: 'Prohibition of employment of women in certain cases',
        text: 'No employer shall knowingly employ a woman in his establishment during the eight weeks immediately following the day of her delivery, miscarriage or medical termination of pregnancy.'
      },
      {
        no: 47,
        title: 'Right to and liability for payment of maternity benefit',
        text: 'Subject to the provisions of this Chapter, every woman shall be entitled to, and her employer shall be liable for, the payment of maternity benefit at the rate of her average daily wage for the period of her actual absence immediately before and after delivery.'
      },
      {
        no: 48,
        title: 'Amount of maternity benefit (প্রসূতি কল্যাণ সুবিধার পরিমাণ)',
        text: 'The maternity benefit payable under this Chapter shall be paid in full cash, or by bank account or electronic fund transfer (EFT) at the rate of average daily, weekly or, as the case may be, monthly wages calculated in the manner specified in sub-section (2). For the purpose of sub-section (1), to calculate the average daily wage, the total wage last fixed for the concerned mother shall be divided by 26 (twenty-six).'
      },
      {
        no: 50,
        title: 'Duration of maternity benefit',
        text: 'The maternity benefit shall be payable for a period not exceeding sixteen weeks, of which not more than eight weeks shall precede the expected date of delivery. In case of miscarriage or medical termination of pregnancy, maternity benefit shall be paid for a maximum period of eight weeks immediately following the day of miscarriage or medical termination.'
      },
    ]
  },
  {
    chapter: 7,
    title: 'Payment of Wages (মজুরী ও উহার পরিশোধ)',
    sections: [
      {
        no: 120,
        title: 'Responsibility for payment of wages (মজুরী পরিশোধের দায়িত্ব)',
        text: 'Every employer shall be responsible for the payment to persons employed by him of all wages required to be paid under this Act. Wages shall be paid in current coin or currency notes or in both, or by cheque or by crediting to the workers\' bank account.'
      },
      {
        no: 121,
        title: 'Fixation of wage period (মজুরী মেয়াদ নির্ধারণ)',
        text: 'Every person responsible for the payment of wages under Section 120 shall fix periods in respect of which such wages shall be payable. No wage period shall exceed one month.'
      },
      {
        no: 125,
        title: 'Deductions which may be made from wages (মজুরী হইতে কর্তন)',
        text: 'Notwithstanding the provisions of Section 124, deductions may be made from the wages of a worker only in accordance with the provisions of this Act and shall be limited to: (a) fines; (b) deductions for absence from duty; (c) deductions for damage to or loss of goods expressly entrusted to the worker for custody; (d) deductions for house accommodation supplied by the employer; (e) deductions for amenities and services supplied by the employer; (f) deductions for recovery of advances; (g) deductions for recovery of loans; (h) deductions for income tax.'
      },
    ]
  },
  {
    chapter: 9,
    title: 'Working Hours and Leave (কমর্ঘন্টা ও ছুটি)',
    sections: [
      {
        no: 100,
        title: 'Daily working hours (দৈনিক কর্মঘণ্টা)',
        text: 'No adult worker shall ordinarily work in an establishment for more than eight hours in any day; provided that any such worker may work for ten hours in any day subject to the provisions of Section 108 relating to extra wages for overtime.'
      },
      {
        no: 101,
        title: 'Intervals for rest or meals (বিশ্রাম বা আহারের জন্য বিরতি)',
        text: 'No worker in an establishment shall: (a) be required or allowed to work for more than six hours in any day unless he has had an interval of at least one hour for rest or meals; (b) be required or allowed to work for more than five hours in any day unless he has had an interval of at least half an hour for that purpose; or (c) be required or allowed to work for more than eight hours in any day unless he has had either one interval under clause (a) or two intervals under clause (b) for that purpose.'
      },
      {
        no: 102,
        title: 'Weekly working hours (সাপ্তাহিক কর্মঘণ্টা)',
        text: 'No adult worker shall ordinarily work in an establishment for more than forty-eight hours in any week. Subject to the provisions of Section 108, an adult worker in an establishment may work for more than forty-eight hours in a week: Provided that the total working hours of such worker in any week shall not exceed sixty hours and shall not exceed an average of fifty-six hours per week in any year. For garment workers in the export zone, total working hours inclusive of overtime cannot exceed 60 hours per week, and the average must not exceed 56 hours per week over a year.'
      },
      {
        no: 103,
        title: 'Weekly holidays (সাপ্তাহিক ছুটি)',
        text: 'A worker employed in an establishment shall be entitled to: (a) one day per week for factories and industries and one and a half days per week for shops and establishments; (b) in case of road transport establishments, one day of continuous twenty-four hours in every week; No deduction shall be made from the worker\'s wages for any leave under clauses (a) and (b).'
      },
      {
        no: 104,
        title: 'Compensatory weekly holidays (ক্ষতিপূরণমূলক সাপ্তাহিক ছুটি)',
        text: 'Where any worker is deprived of any leave to which he is entitled under Section 103 as a result of any order issued granting exemption to an establishment or workers employed therein from the provisions of that section, or as a result of any rules made under this Act, such worker shall be granted, as soon as circumstances permit, leave equal in number to the days of leave so foregone.'
      },
      {
        no: 105,
        title: 'Spread over of working hours (কর্ম সময়ের সমপ্রসারণ)',
        text: 'The working hours of an adult worker employed in an establishment shall be so arranged that, exclusive of intervals for rest or meals allowed under Section 101, they shall not spread over more than ten hours, except with the permission of the Government granted generally or in respect of a particular establishment and subject to such conditions as may be imposed by it.'
      },
      {
        no: 108,
        title: 'Extra wages for overtime (অধিকাল কর্মের জন্য অতিরিক্ত ভাতা)',
        text: 'Where a worker works in an establishment on any day or week in excess of the hours fixed under this Act, he shall, in respect of overtime work, be entitled to allowance at the rate of twice his basic wages plus dearness allowance and ad hoc or interim wages, if any. The provisions of sub-section (1) shall not apply to workers paid on piece-rate basis.'
      },
      {
        no: 109,
        title: 'Restricted working hours for women (নারী শ্রমিকের জন্য সীমিত কর্মঘণ্টা)',
        text: 'No woman worker shall be required to work in any establishment between the hours of 10 p.m. and 6 a.m. without her consent.'
      },
      {
        no: 115,
        title: 'Annual leave with wages (বাৎসরিক ছুটি)',
        text: 'Every worker who has completed one year of continuous service in an establishment shall be allowed during the subsequent period of twelve months, leave with wages for a number of days calculated at the rate of one day for every eighteen days of work performed by him during the previous period of twelve months.'
      },
    ]
  },
  {
    chapter: 10,
    title: 'Wages Board (মজুরী বোর্ড)',
    sections: [
      {
        no: 138,
        title: 'Establishment of Minimum Wages Board (নিম্নতম মজুরী বোর্ড প্রতিষ্ঠা)',
        text: 'The Government may, by notification in the official Gazette, constitute one or more Minimum Wages Boards for fixing minimum rates of wages for workers employed in any scheduled industry. The Board shall consist of such number of members as the Government may deem fit, representing employers, workers and independent persons.'
      },
      {
        no: 140,
        title: 'Procedure for fixing minimum rates of wages',
        text: 'The Wages Board shall fix minimum rates of wages for time work and for piece work and may fix such rates for the whole of any scheduled industry or for any part thereof or for any specified class of work in the industry. The Board shall give due regard to: (a) the cost of living; (b) the standard of living; (c) the capacity of the industry to pay; and (d) such other factors as may be relevant.'
      }
    ]
  },
  {
    chapter: 11,
    title: 'Wages, Gratuity and Other Benefits',
    sections: [
      {
        no: 52,
        title: 'Gratuity (গ্র্যাচুইটি)',
        text: 'Where a worker who has completed at least one year of continuous service is dismissed, discharged, retrenched, retired, laid off or his services have been terminated or he has died while in service, the employer shall pay to such worker or his nominee, gratuity at the rate of thirty days wages for every completed year of service or for any part thereof exceeding six months based on the last drawn wages. For service exceeding ten years, gratuity shall be paid at the rate of forty-five days wages for every completed year of service. The gratuity shall be paid within thirty days from the date it becomes payable.'
      },
    ]
  },
  {
    chapter: 12,
    title: 'Compensation for Injury by Accident (দুর্ঘটনাজনিত কারণে জখমের জন্য ক্ষতিপূরণ)',
    sections: [
      {
        no: 150,
        title: 'Employer\'s liability for compensation (ক্ষতিপূরণ প্রদানের জন্য মালিকের দায়িত্ব)',
        text: 'If personal injury is caused to a worker by accident arising out of and in the course of his employment, his employer shall be liable to pay compensation in accordance with the provisions of this Chapter: Provided that the employer shall not be liable in respect of any injury which does not result in the total or partial disablement of the worker for a period exceeding three days.'
      },
      {
        no: 151,
        title: 'Amount of compensation',
        text: 'The amount of compensation shall be as follows: (a) where death results from the injury, an amount equal to fifty percent of the monthly wages of the deceased worker multiplied by the relevant factor; or an amount of two lakh Taka, whichever is higher. (b) where permanent total disablement results from the injury, an amount equal to sixty percent of the monthly wages of the injured worker multiplied by the relevant factor; or an amount of two lakh and fifty thousand Taka, whichever is higher.'
      }
    ]
  },
  {
    chapter: 13,
    title: 'Safety and Health (শ্রমিকের স্বাস্থ্য, নিরাপত্তা ও কল্যাণ)',
    sections: [
      {
        no: 51,
        title: 'Cleanliness (কারখানা পরিষ্কার-পরিচ্ছন্ন রাখা)',
        text: 'Every factory shall be kept clean and free from effluvia arising from any drain, privy or other nuisance. The floors of every workroom shall be cleaned at least once in every week by washing, using disinfectant where necessary, or by some other effective method.'
      },
      {
        no: 77,
        title: 'Drinking water',
        text: 'In every factory, effective arrangements shall be made to provide and maintain at suitable points conveniently situated for all workers employed therein, a sufficient supply of wholesome drinking water. All such points shall be legibly marked "Drinking Water" in a language understood by a majority of the workers.'
      },
    ]
  },
  {
    chapter: 14,
    title: 'Trade Unions (ট্রেড ইউনিয়ন)',
    sections: [
      {
        no: 179,
        title: 'Right to form trade unions',
        text: 'Subject to the provisions of this Act, workers and employers shall have the right to form and join trade unions and federations of their choice without any previous authorization. Workers and employers and their respective organizations shall have the right to draw up their own constitutions and rules, and to elect their representatives in full freedom.'
      },
      {
        no: 202,
        title: 'Collective Bargaining Agent (CBA)',
        text: 'In every industrial establishment employing fifty or more workers, a trade union may be recognized as the Collective Bargaining Agent for the workers of that establishment. The CBA shall have the right to participate in collective bargaining with the employer regarding wages, hours of work, leave, holidays, terms and conditions of employment and other matters affecting the relationship between employers and workers.'
      }
    ]
  },
  {
    chapter: 19,
    title: 'Penalties and Procedure (অপরাধ, দন্ড এবং পদ্ধতি)',
    sections: [
      {
        no: 306,
        title: 'Penalty for obstruction (বাধা প্রদানের দণ্ড)',
        text: 'Whoever willfully obstructs an Inspector or other officer in the exercise of any power conferred on him by or under this Act, or conceals or prevents any worker from appearing before or being examined by an Inspector or other officer, shall be punishable with imprisonment for a term which may extend to three months, or with fine which may extend to Taka five thousand, or with both.'
      },
      {
        no: 307,
        title: 'General penalty',
        text: 'Whoever contravenes any provision of this Act or of any rule or regulation or order made thereunder, shall, if no other penalty is provided for such contravention, be punishable with imprisonment for a term which may extend to six months, or with fine which may extend to Taka ten thousand, or with both.'
      }
    ]
  },
];

const LaborLawPage = () => {
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lang, setLang] = useState<'EN' | 'BN'>('EN');

  // Search logic
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results: { chapter: number; chapterTitle: string; section: any }[] = [];
    labourActData.forEach(ch => {
      ch.sections.forEach(sec => {
        if (
          sec.title.toLowerCase().includes(q) ||
          sec.text.toLowerCase().includes(q) ||
          String(sec.no).includes(q)
        ) {
          results.push({ chapter: ch.chapter, chapterTitle: ch.title, section: sec });
        }
      });
    });
    return results;
  }, [searchQuery]);

  // Highlight search term in text
  const highlight = (text: string) => {
    if (!searchQuery.trim()) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((p, i) =>
      p.toLowerCase() === searchQuery.toLowerCase()
        ? <mark key={i} className="bg-[#f9a825]/30 text-[#1a2f23] font-black px-1 rounded">{p}</mark>
        : p
    );
  };

  const activeChapter = labourActData.find(c => c.chapter === selectedChapter);
  const activeSection = activeChapter?.sections.find(s => s.no === selectedSection);

  const quickSuggestions = [
    { icon: '⏰', label: 'Overtime Rules', ch: 9, sec: 108 },
    { icon: '🤱', label: 'Maternity Leave', ch: 4, sec: 46 },
    { icon: '💰', label: 'Gratuity Rights', ch: 11, sec: 52 },
  ];

  return (
    <div className="min-h-[calc(100vh-66px)] bg-stone-50 flex flex-col font-manrope">

      {/* ── Header ── */}
      <div className="bg-[#006a4e] px-8 py-6 border-b-2 border-[#f42a41]">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#f9a825] mb-1">
              Official Judicial Resource
            </p>
            <h1 className="font-garamond italic font-black uppercase tracking-tight text-4xl md:text-5xl text-white">
              Bangladesh Labour Act, 2006
            </h1>
            <p className="text-white/50 text-sm font-medium mt-1">
              350+ sections · Full text · Bilingual (English &amp; বাংলা)
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search pill */}
            <div className="bg-white/10 rounded-full border border-white/20 px-5 py-2.5 flex items-center gap-2.5">
              <Search className="w-4 h-4 text-white/50 flex-shrink-0" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search sections, keywords..."
                className="bg-transparent border-none outline-none text-white placeholder-white/30 font-medium text-sm w-48"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-white/40 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {/* Language toggle */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setLang(l => l === 'EN' ? 'BN' : 'EN')}
              className="px-4 py-2.5 rounded-full bg-white/10 text-white text-xs font-black uppercase tracking-widest border border-white/20 flex items-center gap-2 hover:bg-white/20 transition-all"
            >
              <Languages className="w-4 h-4" /> {lang === 'EN' ? 'বাংলা' : 'English'}
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex flex-1 max-w-[1400px] mx-auto w-full overflow-hidden">

        {/* Search results overlay */}
        {searchQuery.trim() ? (
          <div className="flex-1 p-6 overflow-y-auto">
            <h2 className="font-garamond italic font-black uppercase tracking-tight text-2xl text-[#1a2f23] mb-1">
              Search Results
            </h2>
            <p className="text-stone-400 text-sm font-medium mb-6">
              Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
            </p>

            {searchResults.length === 0 ? (
              <div className="text-center py-20">
                <Search className="w-12 h-12 mx-auto mb-4 text-stone-300" />
                <p className="text-stone-400 font-medium">No results found. Try different keywords.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {searchResults.map((result, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => {
                      setSelectedChapter(result.chapter);
                      setSelectedSection(result.section.no);
                      setSearchQuery('');
                    }}
                    className="w-full text-left bg-white border-2 border-stone-100 rounded-3xl p-5 hover:border-[#006a4e] hover:shadow-lg hover:shadow-green-900/5 transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 rounded-full bg-[#fdf2f3] text-[#f42a41] text-[10px] font-black uppercase tracking-widest">
                        § {result.section.no}
                      </span>
                      <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                        Chapter {result.chapter}
                      </span>
                    </div>
                    <h3 className="font-bold text-[#1a2f23] mb-1 group-hover:text-[#006a4e] transition-colors">
                      {highlight(result.section.title)}
                    </h3>
                    <p className="text-sm text-stone-500 line-clamp-2">
                      {highlight(result.section.text.substring(0, 200))}
                    </p>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Chapters sidebar */}
            <div className="w-56 flex-shrink-0 bg-stone-100 border-r border-stone-200 overflow-y-auto p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-3 px-1">
                Chapters
              </p>
              {labourActData.map(ch => (
                <motion.button
                  key={ch.chapter}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setSelectedChapter(ch.chapter); setSelectedSection(null); }}
                  className={`w-full text-left p-3 rounded-2xl mb-1 transition-all ${
                    selectedChapter === ch.chapter
                      ? 'bg-[#006a4e] text-white shadow-lg shadow-green-900/20'
                      : 'hover:bg-white text-stone-600 hover:text-[#1a2f23]'
                  }`}
                >
                  <div className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${
                    selectedChapter === ch.chapter ? 'text-[#f9a825]' : 'text-[#f42a41]'
                  }`}>
                    Chapter {ch.chapter}
                  </div>
                  <div className="font-bold text-sm leading-snug">
                    {ch.title.split('(')[0].trim()}
                  </div>
                  <div className={`text-xs mt-0.5 ${selectedChapter === ch.chapter ? 'text-white/60' : 'text-stone-400'}`}>
                    {ch.sections.length} sections
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Sections + Content */}
            {selectedChapter && activeChapter ? (
              <>
                {/* Sections list */}
                <div className="w-52 flex-shrink-0 bg-white border-r border-stone-100 overflow-y-auto p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-3 px-1">
                    Sections
                  </p>
                  {activeChapter.sections.map(sec => (
                    <button
                      key={sec.no}
                      onClick={() => setSelectedSection(sec.no)}
                      className={`w-full text-left p-3 rounded-2xl mb-1 transition-all border-l-4 ${
                        selectedSection === sec.no
                          ? 'bg-[#ecf7f1] border-[#006a4e]'
                          : 'border-transparent hover:bg-stone-50'
                      }`}
                    >
                      <div className="text-[10px] font-black text-[#f42a41] mb-1">§ {sec.no}</div>
                      <div className="font-medium text-sm text-[#1a2f23] line-clamp-2 leading-snug">
                        {sec.title.split('(')[0].trim()}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Section content */}
                <div className="flex-1 overflow-y-auto p-8 md:p-10 bg-white">
                  {activeSection ? (
                    <motion.div
                      key={`${selectedChapter}-${selectedSection}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="max-w-2xl"
                    >
                      <div className="flex items-center gap-3 mb-5">
                        <span className="px-4 py-1.5 rounded-full bg-[#ecf7f1] text-[#006a4e] text-[10px] font-black uppercase tracking-widest">
                          Section {activeSection.no}
                        </span>
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                          Chapter {selectedChapter}
                        </span>
                      </div>

                      <h2 className="font-garamond italic font-black uppercase tracking-tight text-3xl md:text-4xl text-[#1a2f23] mb-6 leading-tight">
                        {activeSection.title}
                      </h2>

                      <div className="border-l-4 border-[#f42a41] pl-5 mb-8">
                        <p className="text-stone-700 font-medium leading-relaxed text-base">
                          {activeSection.text}
                        </p>
                      </div>

                      {/* Source card */}
                      <div className="bg-stone-50 rounded-3xl p-5 flex items-center gap-3 mb-4">
                        <Scale className="w-5 h-5 text-[#006a4e] flex-shrink-0" />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-0.5">Source</p>
                          <p className="text-sm font-bold text-[#f42a41]">
                            Section {activeSection.no} — Bangladesh Labour Act 2006
                          </p>
                        </div>
                      </div>

                      <div className="bg-stone-50 rounded-3xl p-4 text-sm text-stone-500 font-medium flex items-start gap-2">
                        <span className="text-[#f42a41] mt-0.5">⚠</span>
                        This is for informational purposes only. Consult a qualified lawyer for legal advice.
                      </div>
                    </motion.div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-[80px] text-[#006a4e]/10 font-black block leading-none mb-4">§</span>
                        <p className="font-garamond italic text-xl text-stone-400">Select a section to read.</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Empty state */
              <div className="flex-1 flex items-center justify-center bg-white p-10">
                <div className="text-center max-w-sm">
                  <div className="text-[120px] text-[#006a4e]/10 font-black leading-none mb-4">§</div>
                  <h3 className="font-garamond italic font-black uppercase tracking-tight text-2xl text-[#1a2f23] mb-2">
                    Select a Chapter
                  </h3>
                  <p className="text-stone-400 font-medium text-sm mb-8">
                    Choose a chapter from the left panel to start browsing.
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {quickSuggestions.map((s, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => { setSelectedChapter(s.ch); setSelectedSection(s.sec); }}
                        className="bg-[#ecf7f1] rounded-3xl p-4 text-left hover:bg-[#006a4e] group transition-all"
                      >
                        <span className="text-lg mb-1 block">{s.icon}</span>
                        <p className="font-black text-sm text-[#006a4e] group-hover:text-white uppercase tracking-wide transition-colors">
                          {s.label}
                        </p>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&family=Manrope:wght@400;500;600;700;800;900&display=swap');
        .font-garamond { font-family: 'EB Garamond', serif; }
        .font-manrope { font-family: 'Manrope', sans-serif; }
      `}</style>
    </div>
  );
};

export default LaborLawPage;
