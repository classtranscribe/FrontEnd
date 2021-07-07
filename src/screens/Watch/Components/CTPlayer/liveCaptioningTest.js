


// function splitter(captionsArray) {
//     let toReturn = [];
//     let currentSegment = {beginTime: captionsArray[1].beginTime, endTime:0, text: ""};
//     for (let i = 0; i < captionsArray.length; i++){
//         if (currentSegment.trim().split(" ").length > 5) {
//             currentSegment.endTime = captionsArray[i].beginTime
//             toReturn.push(currentSegment);
//             currentSegment = {beginTime: captionsArray[i].beginTime, endTime:0, text: ""};
//             console.log("yooo")
//         }
//         captionsArray[i] = captionsArray[i].replaceAll("\n", " ");
//         captionsArray[i] = captionsArray[i].replaceAll(".", " ");

//         let currentText = captionsArray[i];
//         // Handle case where toReturn is Empty
//         if (toReturn.length == 0) {
//             toReturn.push({beginTime: captionsArray[0].beginTime, endTime: captionsArray[0].endTime, text: captionsArray[0].text});
//             continue;
//         }

//         // split indivisual words in the new segment im currently looking at
//         let words = currentText.split(" ");
        
//         // if (words.length == 0 || words.length == 1) {
//         //     if (currentSegment.includes(currentText)) {
//         //         continue;
//         //     } else {
//         //         currentSegment = currentSegment += (` ${ currentText.trim()}`)
//         //         continue;
//         //     }
//         // }
//         let correctStartFound = words.length - 1;
        
//         let prevArray = captionsArray[i - 1].split(" ")
//         let prevWord = prevArray[prevArray.length - 1]
//         let firstWord = prevArray[0]
//         if (currentText.includes(prevWord.trim())) {
//         	for (let j = words.length - 1; j > 0; j -= 1) {
//             	console.log(words)
//             	if (words[j].trim() === prevWord.trim() && words[j].trim() != "") {
//                 correctStartFound = j + 1
//                 break
//                }
//             }
//             console.log(correctStartFound)
            
//             for (let j = correctStartFound; j < words.length; j+= 1){
//             	if (words[j].trim() != ""){
//             		currentSegment.text += ` ${ words[j].trim()}`
//                 }
//             }
//         } else if(firstWord == words[0]) {
//         	continue;
//         }else {
//         	console.log("causing problems")
//         	currentSegment.text += currentText.trim()
//         }
//     }
// 	toReturn.push(currentSegment);
// 	console.log(captionsArray)
//     return toReturn;
// }