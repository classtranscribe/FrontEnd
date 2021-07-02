


function splitter(captionsArray) {
    let toReturn = [];
    let currentSegment = "";
    for (let i = 0; i < captionsArray.length; i++){
        if (currentSegment.trim().split(" ").length > 5) {
            toReturn.push(currentSegment);
            currentSegment = "";
            console.log("yooo")
        }
        captionsArray[i] = captionsArray[i].replaceAll("\n", "");
        let currentText = captionsArray[i];

        //Handle case where toReturn is Empty
        if (toReturn.length == 0) {
            toReturn.push(currentText);
            continue;
        }

        //split indivisual words in the new segment im currently looking at
        let words = currentText.split(" ");
        
        if (words.length == 0 || words.length == 1) {
            if (currentSegment.includes(currentText)) {
                continue;
            } else {
                currentText = currentText += (" " + currentText.trim())
                continue;
            }
        }
        let correctStartFound = false;
        
        let prevArray = captionsArray[i - 1].split(" ")
        let prevWord = prevArray[prevArray.length - 1]
        let firstWord = prevArray[0]
        if (currentText.includes(prevWord.trim())) {
        	for (let j = 0; j < words.length; j++) {
            	if (words[j].trim() === prevWord.trim()) {
            			correctStartFound = true;
                        continue
               }
               
               if (correctStartFound) {
                    currentSegment += (" " + words[j].trim())

               
               }
            }

        } else if(firstWord == words[0]) {
        	continue;
        	
        
        }else {
        	currentSegment += currentText.trim()
        }

    }
	toReturn.push(currentSegment);

    return toReturn;
}
