export type Locale = 'en' | 'ne'

const dictionary: Record<Locale, Record<string, string>> = {
  en: {
    // Navigation
    nav_why: 'Why Farm',
    nav_path: 'Your Path',
    nav_calculator: 'Calculator',
    nav_getstarted: 'Get Started',
    nav_community: 'Community',
    start_now: 'Start Now',
    explore: 'Explore',
    
    // Hero Section
    hero_badge: '🌱 Sustainable • 👥 Community • 📈 Growth',
    hero_title: 'Grow Your Future',
    hero_subtitle: 'in the Heart of Kathmandu Valley',
    hero_description: 'Grow food. Build community. Live sustainably.',
    hero_tagline: 'Your meaningful life starts here.',
    hero_cta_main: 'Begin Your Journey',
    hero_cta_secondary: 'Learn Our Story',
    hero_scroll: 'Discover More',
    
    // Stats
    stats_families: 'Families ❤️ Land',
    stats_plot: 'Perfect Plot Size 🌱',
    stats_demand: 'Organic Food Demand 📈',
    
    // Action Plan
    action_title: 'Your Journey Begins Here',
    action_subtitle: 'Every great adventure starts with a single step. Here\'s your roadmap to creating the life you\'ve always dreamed of—one that\'s connected to the earth and filled with meaning.',
    action_step1_title: 'Listen to Your Heart',
    action_step1_desc: 'Find a piece of land that speaks to your soul',
    action_step2_title: 'Get to Know Your Land',
    action_step2_desc: 'Test the soil and water to understand what you\'re working with',
    action_step3_title: 'Make Your Agreement',
    action_step3_desc: 'Create a fair arrangement that works for everyone',
    action_step4_title: 'Make It Official',
    action_step4_desc: 'Register your agreement at the local office',
    action_step5_title: 'Build Your Dream Step by Step',
    action_step5_desc: 'Start small and grow as you learn',
    action_step6_title: 'Connect with Your Community',
    action_step6_desc: 'Find people who want what you\'re growing',
    
    // Financial Calculator
    calc_title: 'Your Journey to Financial Freedom',
    calc_subtitle: 'This isn\'t about getting rich—it\'s about building a life where your work sustains you and your family. Use this tool to understand your path to financial independence.',
    calc_land_size: 'Land Size (Ropani)',
    calc_projection: 'Your Journey Projection',
    calc_positive: '📈 Positive',
    calc_investment: '📉 Investment Phase',
    calc_see_plan: 'See Your Action Plan',
    calc_get_help: 'Get Expert Help',
    
    // Contact
    contact_title: 'Your Community Awaits',
    contact_subtitle: 'You\'re not alone on this journey. Connect with people who share your dreams, organizations that can help you grow, and places where your harvest will find a home.',
    contact_form_title: 'Get in Touch',
    contact_name: 'Your Name',
    contact_email: 'Email Address',
    contact_message: 'Your Message',
    contact_message_placeholder: 'Tell us about your dreams, questions, or how we can help...',
    contact_send: 'Send Message',
    contact_sending: 'Sending...',
    contact_success: 'Message sent! We\'ll get back to you soon.',
    contact_error: 'Something went wrong. Please try again.',
  },
  ne: {
    // Navigation
    nav_why: 'किन कृषि ?',
    nav_path: 'तपाईंको बाटो',
    nav_calculator: 'क्याल्कुलेटर',
    nav_getstarted: 'सुरु गर्नुस्',
    nav_community: 'समुदाय',
    start_now: 'अहिले सुरु',
    explore: 'अन्वेषण',
    
    // Hero Section
    hero_badge: '🌱 दिगो • 👥 समुदाय • 📈 बृद्धि',
    hero_title: 'आफ्नो भविष्य फुलाउनुस्',
    hero_subtitle: 'काठमाडौं उपत्यकाको मुटुमा',
    hero_description: 'खाना उब्जाउनुस्। समुदाय निर्माण गर्नुस्। दिगो जीवन बिताउनुस्।',
    hero_tagline: 'तपाईंको अर्थपूर्ण जीवन यहाँबाट सुरु हुन्छ।',
    hero_cta_main: 'आफ्नो यात्रा सुरु गर्नुस्',
    hero_cta_secondary: 'हाम्रो कथा जान्नुस्',
    hero_scroll: 'थप पत्ता लगाउनुस्',
    
    // Stats
    stats_families: 'परिवारहरू ❤️ जमिन',
    stats_plot: 'उत्तम प्लट साइज 🌱',
    stats_demand: 'जैविक खाना माग 📈',
    
    // Action Plan
    action_title: 'तपाईंको यात्रा यहाँबाट सुरु हुन्छ',
    action_subtitle: 'हरेक महान् साहसिक कार्य एउटै कदमबाट सुरु हुन्छ। तपाईंले सधैं सपना देख्नुभएको जीवन सिर्जना गर्नको लागि यो तपाईंको रोडम्याप हो—जुन पृथ्वीसँग जोडिएको र अर्थले भरिएको छ।',
    action_step1_title: 'आफ्नो मनको कुरा सुन्नुस्',
    action_step1_desc: 'तपाईंको आत्मासँग कुरा गर्ने जमिनको टुक्रा भेट्टाउनुस्',
    action_step2_title: 'आफ्नो जमिनलाई चिन्नुस्',
    action_step2_desc: 'माटो र पानीको जाँच गर्नुस् र के काम गरिरहनुभएको छ भनेर बुझ्नुस्',
    action_step3_title: 'आफ्नो सम्झौता गर्नुस्',
    action_step3_desc: 'सबैका लागि काम गर्ने निष्पक्ष व्यवस्था सिर्जना गर्नुस्',
    action_step4_title: 'यसलाई आधिकारिक बनाउनुस्',
    action_step4_desc: 'स्थानीय कार्यालयमा आफ्नो सम्झौता दर्ता गर्नुस्',
    action_step5_title: 'आफ्नो सपना कदम-कदममा निर्माण गर्नुस्',
    action_step5_desc: 'सानोबाट सुरु गर्नुस् र सिक्दै बढ्नुस्',
    action_step6_title: 'आफ्नो समुदायसँग जोडिनुस्',
    action_step6_desc: 'तपाईंले उब्जाउनुभएको कुरा चाहने मानिसहरूलाई भेट्टाउनुस्',
    
    // Financial Calculator
    calc_title: 'आर्थिक स्वतन्त्रताको लागि तपाईंको यात्रा',
    calc_subtitle: 'यो धनी बन्ने बारेमा होइन—यो तपाईंको काम र परिवारलाई सम्हाल्ने जीवन निर्माण गर्ने बारेमा हो। आर्थिक स्वतन्त्रताको बाटो बुझ्न यो उपकरण प्रयोग गर्नुस्।',
    calc_land_size: 'जमिनको साइज (रोपनी)',
    calc_projection: 'तपाईंको यात्रा प्रक्षेपण',
    calc_positive: '📈 सकारात्मक',
    calc_investment: '📉 लगानी चरण',
    calc_see_plan: 'आफ्नो कार्य योजना हेर्नुस्',
    calc_get_help: 'विशेषज्ञ सहायता लिनुस्',
    
    // Contact
    contact_title: 'तपाईंको समुदायले पर्खिरहेको छ',
    contact_subtitle: 'यो यात्रामा तपाईं एक्लै हुनुहुन्न। तपाईंका सपनाहरू साझा गर्ने मानिसहरू, तपाईंलाई बढ्न मद्दत गर्न सक्ने संस्थाहरू, र तपाईंको फसलले घर पाउने ठाउँहरूसँग जोडिनुस्।',
    contact_form_title: 'सम्पर्कमा रहनुस्',
    contact_name: 'तपाईंको नाम',
    contact_email: 'इमेल ठेगाना',
    contact_message: 'तपाईंको सन्देश',
    contact_message_placeholder: 'तपाईंका सपनाहरू, प्रश्नहरू, वा हामीले कसरी मद्दत गर्न सक्छौं भन्ने बारेमा भन्नुस्...',
    contact_send: 'सन्देश पठाउनुस्',
    contact_sending: 'पठाउँदै...',
    contact_success: 'सन्देश पठाइयो! हामी चाँडै तपाईंलाई फिर्ता सम्पर्क गर्नेछौं।',
    contact_error: 'केही गलत भयो। कृपया पुनः प्रयास गर्नुस्।',
  },
}

export const t = (key: string, locale: Locale = 'en') => {
  return dictionary[locale][key] || dictionary.en[key] || key
} 