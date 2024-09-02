/**
 * 
 * @param textarea 
 * @returns Le nombre de caractères actuellement écrits dans le textarea
 */
const getTextareaCharacterCount = (textarea: HTMLTextAreaElement): number => {
    return textarea.value.length;
};

export { getTextareaCharacterCount };
