const splitLyrics = (text: string, _maxLineLength = 42): string[] => {
  /* create an array of words */
  const words = text.split(" ");

  /* the result in array form, map it to get string*/
  const resultLines: string[] = [];
  
  /* the current line being built */
  let currentLine = "";

  for ( const word of words ) {
    if ( (currentLine + word).length <= _maxLineLength ) {
      // If it's not the first word in the whole lyrics, add a space before the word
      currentLine += ( currentLine ? " ": "") + word;
    } else {
      // put the line in the result
      resultLines.push(currentLine);
      // start new line with the word since it overflows if we add it to same line
      currentLine = word;
    }
  }

  // if there is left words in currentline, push it in the result
  if (currentLine) resultLines.push(currentLine);

  // return the resultLines
  return resultLines;
}

export default splitLyrics;