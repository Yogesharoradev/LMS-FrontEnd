export const courseCurriculumInitialFormData = [
    {
        title : "",
        videoUrl : "",
        freePreview : false ,
        public_id : ""
    }
]

export const courseLandingInitialFormData = {
    title :"",
    category : "",
    level: "",
    primaryLanguage :"",
    subtitle : "",
    description : "",
    pricing :"",
    objectives : "",
    welcomeMessage :"",
    image :"",
}


export const courseCategories = [
    { id: "webDevelopment", label: "Web Development" },
    { id: "dataScience", label: "Data Science" },
    { id: "artificialIntelligence", label: "Artificial Intelligence" },
    { id: "design", label: "Design" },
    { id: "business", label: "Business" },
    { id: "marketing", label: "Marketing" },
    { id: "finance", label: "Finance" },
    { id: "personalDevelopment", label: "Personal Development" },
    { id: "cyberSecurity", label: "Cybersecurity" },
    { id: "cloudComputing", label: "Cloud Computing" }
 ];
 

 export const courseLevelOptions = [
    { id : "beginner" , label : "Beginner" },
    { id : "intermediate" , label : "Intermediate" },
    { id : "advance" , label : "Advance" },

 ]

 export const languageOptions = [
    { id: "english", label: "English" },
    { id: "spanish", label: "Spanish" },
    { id: "french", label: "French" },
    { id: "german", label: "German" },
    { id: "mandarin", label: "Mandarin" },
    { id: "hindi", label: "Hindi" },
    { id: "arabic", label: "Arabic" },
    { id: "portuguese", label: "Portuguese" },
    { id: "russian", label: "Russian" },
    { id: "japanese", label: "Japanese" },
    { id: "korean", label: "Korean" },
    { id: "italian", label: "Italian" },
    { id: "bengali", label: "Bengali" },
    { id: "urdu", label: "Urdu" },
    { id: "turkish", label: "Turkish" },
    { id: "thai", label: "Thai" },
    { id: "vietnamese", label: "Vietnamese" },
];


export const filterOptions = {
    category : courseCategories,
    level : courseLevelOptions ,
    primaryLanguage :  languageOptions
}