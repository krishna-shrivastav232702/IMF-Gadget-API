export const  generateCodename = () => {
    const prefixes = ["The", "Project", "Operation", "Agent", "Mission", "Taskforce", "Codename", "Protocol"];
    const names = ["Nightingale", "Kraken", "Phoenix", "Shadow", "Oracle", "Titan", "Spectre", "Falcon", "Echo", "Cipher", "Vortex", "Onyx", "Nemesis", "Gladius"];
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${names[Math.floor(Math.random() * names.length)]}`;
};