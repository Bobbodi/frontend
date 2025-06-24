export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const getInitials = (name) => {
    if (!name) return "";

    const nameParts = name.split(" ");
    let initials = "";

    for (let i = 0; i < nameParts.length; i++) {
        initials += nameParts[i][0];
    } 

    return initials.toUpperCase();
}

export const getRelativeDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0);

    const thisMonday = new Date(today);
    thisMonday.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
    
    const diffFromMonday = Math.round((selected - thisMonday) / (1000 * 60 * 60 * 24));
    const diffInDays = Math.round((selected - today) / (1000 * 60 * 60 * 24));
    const diffInWeeks = Math.floor(diffFromMonday / 7);
    
    switch (diffInDays) {
        case 0: return "Today";
        case 1: return "Tomorrow";
        case -1: return "Yesterday";
    }
    switch (diffFromMonday) {
        case 0: case 1: case 2: case 3: case 4: case 5: case 6: 
        return `This ${selected.toLocaleDateString('en-US', { weekday: 'long' })}`;
        case -1: case -2: case -3: case -4: case -5: case -6: 
        return `Last ${selected.toLocaleDateString('en-US', { weekday: 'long' })}`;
        default:
        if (diffInWeeks === 1) return `Next ${selected.toLocaleDateString('en-US', { weekday: 'long' })}`;
        if (diffInWeeks === -1) return `Last ${selected.toLocaleDateString('en-US', { weekday: 'long' })}`;
        // if (diffInDays > 6 && diffInDays <= 14) return "In 2 weeks";
        // if (diffInDays < -6 && diffInDays >= -14) return "2 weeks ago";
        return selected.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            ...(selected.getFullYear() !== today.getFullYear() && { year: 'numeric' })
        });
    }
};