// import DOMPurify
import DOMPurify from 'dompurify';

// ... other imports

const CommunityChat = () => {  
    // chat component code 
    const sanitizedMessage = DOMPurify.sanitize(message);

    // render component 
};

export default CommunityChat;