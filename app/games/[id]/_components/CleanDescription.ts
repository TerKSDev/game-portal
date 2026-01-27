export function GetCleanDescription(htmlContent: string | null): string {
    if (!htmlContent) return 'Description not available.';

    const descriptionLanguge = [
        '<p>Español', 'Español<br',
        '<p>Deutsch', 'Deutsch<br',
        '<p>Français', 'Français<br',
        '<p>Italiano',
        '<p>Português',
        '<p>日本語',
        '<p>中文',
        '<p>한국어',
        '<p>Pусский'
    ];

    let cleanedDescription = htmlContent;

    for (const phrase of descriptionLanguge) {
        if (cleanedDescription.includes(phrase)) {
            cleanedDescription = cleanedDescription.split(phrase)[ 0 ];
        }
    }

    return cleanedDescription;
}