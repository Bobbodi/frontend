//FOR NAVBAR PROFILE
export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

//FOR SEE ALL SLEEP
export const formatDatetimeLocal = (date) => {
  date = new Date(date); 
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const formatDate  = (date) => { 
    return date.toLocaleDatestring('en-US', {month: 'short', day: 'numeric'});
}

export const calcSleepDuration = (start, end) => { 
    const diff = end.getTime() - start.getTime();   
    return diff / (1000 * 60 * 60); //convert ot hours;
}

export const timeToHours = (date) => { 
    return date.getHours + date.getMinutes() / 60; //change to 24Hr format
}

//FOR SLEEP IN WELLNESS
export const yestMidnight = () => { 
    const now = new Date(); 
    const yest = new Date(now); 
    yest.setHours(0, 0, 0, 0);
    return yest; 
}

export const todayMorn = () => { 
    const now = new Date(); 
    const tdy = new Date(now); 
    tdy.setHours(9, 0, 0, 0); 
    return tdy; 
}
export const getGreeting = () => { 
    const rand = Math.random(); 
    return rand < 0.1 
    ? "Hi Honey "
    : rand < 0.2
    ? "Hi Gorgeous "
    : rand < 0.3
    ? "Hi Sissy "
    : rand < 0.4 
    ? "Hi Smurf "
    : rand < 0.5 
    ? "Hi Startight "
    : rand < 0.6
    ? "Missy Sissy "
    : rand < 0.7 
    ? "Hey Darling "
    : rand < 0.8 
    ? "Hi Pet "
    : rand < 0.9 
    ? "Hi Sweetie "
    : "Hey Pookie ";
}

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

export const estimateTaskDuration = (task, productivity) => {
    const { title, content, priority } = task; 

    let estimatedTime = 60; 

    const titleLower = title.toLowerCase(); 
    const shortTaskKeywords = ["email", "call", "message", "check", 
                            "reply", "quick", "help", "teach", "look", 
                            "remember", "bring"]
    const longTaskKeywords = ["review", "prepare", "draft", "read",
                            "code", "submit", "complete", "update", "do", 
                            "prep", "prepare", "find", "record"]
    const veryLongTaskKeywords = ["write", "essay", "presentation", "test", 
                            "exam", "revise", "finals", "midterms", 
                            "research", "meeting", "paper", "past year", 
                            ];
    
    //contains keywords in title that suggest task difficulty
    if (shortTaskKeywords.some(keyword => titleLower.includes(keyword))) { 
        estimatedTime = 30;
    } else if (longTaskKeywords.some(keyword => titleLower.includes(keyword))) { 
        estimatedTime = 120;
    } else if (veryLongTaskKeywords.some(keyword => titleLower.includes(keyword))) { 
        estimatedTime = 180;
    } 

    //longer content -> more details -> longer
    if (content) { 
        const wordCount = content.split(/\s+/).length; 
        if (wordCount > 20) { 
            estimatedTime += 20;
        } else if (wordCount > 10) { 
            estimatedTime += 10;
        }
    }

    return estimatedTime * (productivity/4); 

}

const normaliseHour = (hour) => {
    return ((hour % 24) + 24) % 24; // Normalize to 0-23 range
}

const isWithinWorkingHours = (currentHour, sleepStart, sleepEnd) => { 
    const normCurr = normaliseHour(currentHour);
    const normStart = normaliseHour(sleepStart);   
    const normEnd = normaliseHour(sleepEnd);
    if (normStart < normEnd) { 
        //doesn't cross midnight, outside sleep period
        return normCurr < normStart || normCurr >= normEnd;
    } else { 
        //crosses midnight, between sleepEnd and sleepStart
        return normCurr >= normEnd && normCurr < normStart;
    }
}

const calculateWorkingHours = (sleepStart, sleepEnd) => {
    const normStart = normaliseHour(sleepStart);
    const normEnd = normaliseHour(sleepEnd);
    let sleepHours; 
    if (normStart <= normEnd) { 
        sleepHours = normEnd - normStart; //doesn't cross midnight
    } else { 
        sleepHours = (24 - normStart) + normEnd; //crosses midnight
    }
    return 24 - sleepHours; //total hours in a day minus sleep hours
} 

const calcRemainingTimeToday = (sleepStart, sleepEnd, workingHours) => { 
    const now = new Date(); 
    const currHour = now.getHours();
    const currMins = now.getMinutes();
    if (!isWithinWorkingHours(currHour, sleepStart, sleepEnd)) { 
        //outside working hours
        return 0; 
    }
    const normCurr = normaliseHour(currHour);
    const normStart = normaliseHour(sleepStart);   
    const normEnd = normaliseHour(sleepEnd);
    let hoursUntilSleep; 
    if (normStart > normEnd) { 
        //crosses midnight
        if (normCurr >= normEnd) { 
            //in afternoon/evening working period 
            hoursUntilSleep = normStart - normCurr;
        } else { 
            hoursUntilSleep = 0; 
        }
    } else { 
        if (normCurr < normStart) { 
            //in morning working period
            hoursUntilSleep = normStart - normCurr;
        } else { 
            hoursUntilSleep = (24 - normCurr) + normStart; 
        }
    }
    const remainingMins = (hoursUntilSleep * 60) - currMins;
    return Math.max(0, Math.min(remainingMins, workingHours * 60)); //ensure it doesn't go negative
}

const calcRemainingTimeTodayFromTime = (sleepStart, sleepEnd, workingHours, referenceTime) => { 
    const currHour = new Date(referenceTime).getHours();
    const currMins = new Date(referenceTime).getMinutes();
    if (!isWithinWorkingHours(currHour, sleepStart, sleepEnd)) { 
        //outside working hours
        return 0; 
    }
    const normCurr = normaliseHour(currHour);
    const normStart = normaliseHour(sleepStart);   
    const normEnd = normaliseHour(sleepEnd);
    let hoursUntilSleep; 
    if (normStart > normEnd) { 
        //crosses midnight
        if (normCurr >= normEnd) { 
            //in afternoon/evening working period 
            hoursUntilSleep = normStart - normCurr;
        } else { 
            hoursUntilSleep = 0; 
        }
    } else { 
        if (normCurr < normStart) { 
            //in morning working period
            hoursUntilSleep = normStart - normCurr;
        } else { 
            hoursUntilSleep = (24 - normCurr) + normStart; 
        }
    }
    const remainingMins = (hoursUntilSleep * 60) - currMins;
    return Math.max(0, Math.min(remainingMins, workingHours * 60)); //ensure it doesn't go negative
}

export const getSuggestions = (tasks, avgSleepStart, avgEndSleep, productivity) => { 
    const workHours = calculateWorkingHours(avgSleepStart, avgEndSleep);

    const settings = { 
        wakeTime: avgEndSleep, 
        sleepTime: avgSleepStart,
        workHours: workHours,
        minBreak: 5, 
        maxBreak: 15, 
        mealBreak: 30, 
        breakInterval: 90,
    };

    const parseDueDate = (dueDate) => { 
        if (!dueDate || dueDate === null) return Infinity; 
        return new Date(dueDate).getTime();
    };

    // Create a deterministic hash function for tie-breaking
    const createDeterministicHash = (task) => {
        const str = task.title + (task.content || '') + (task.id || '');
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash;
    };

    const sortedTasks = [...tasks].sort((a, b) => { 
        const aDue = parseDueDate(a.dueDate);
        const bDue = parseDueDate(b.dueDate);
        if (aDue !== bDue) return aDue - bDue; // Sort by due date first
        if (a.priority !== b.priority) return b.priority - a.priority; // Then by priority
        return createDeterministicHash(a) - createDeterministicHash(b); // Finally by deterministic hash
    });

    //Group tasks by day 
    const dailySchedule = {}
    //calculate remaining hours
    const currentTime = new Date().getTime();
    const referenceTime = currentTime || new Date();
    let currentDay = new Date(referenceTime); 
    let remainingTimeToday = currentTime ? 
        calcRemainingTimeTodayFromTime(avgSleepStart, avgEndSleep, workHours, currentTime) : 
        calcRemainingTimeToday(avgSleepStart, avgEndSleep, workHours);

    let dayKey; 
    console.log(currentDay, remainingTimeToday, workHours);
    for (const task of sortedTasks) { 
        if (task.isEvent) { 
            //an event 
            dayKey = new Date(task.dueDate).toDateString(); 
            if (!dailySchedule[dayKey]) { 
                dailySchedule[dayKey] = [];
            }
            dailySchedule[dayKey].push(task); 
            continue; 
        }

        const duration = estimateTaskDuration(task, productivity);

        //no time to finish today, push to next day
        if (duration > remainingTimeToday) { 
            currentDay = new Date(currentDay); 
            currentDay.setDate(currentDay.getDate() + 1); 
            remainingTimeToday = workHours * 60; 
        }

        //Add task to current day 
        dayKey = currentDay.toDateString(); 
        if (!dailySchedule[dayKey]) { 
            dailySchedule[dayKey] = [];
        }
        dailySchedule[dayKey].push(task); 

        //updateTimeLeft
        remainingTimeToday -= duration; 
        //add break time  
        if (duration >= settings.breakInterval) { 
            const breakDuration = Math.min(Math.max(settings.minBreak, duration/10), 
                                            settings.maxBreak);
            remainingTimeToday -= breakDuration;
        }
        //no time left today, move to next day
        if (remainingTimeToday <= 0) {
            currentDay = new Date(currentDay); 
            currentDay.setDate(currentDay.getDate() + 1); 
            remainingTimeToday = workHours * 60; //reset to full working hours
        }
    }

    const result = {}
    const sortedDays = Object.keys(dailySchedule).sort();
    sortedDays.forEach(day => { 
        const date = new Date(day); 
        result[date] = dailySchedule[day];
    });
    console.log("result", result);
    return result;
}
        