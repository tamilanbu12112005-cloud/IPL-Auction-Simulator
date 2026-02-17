
const PLAYER_STATS = {
  // MARQUEE BATSMEN
  "Virat Kohli": { matches: 255, runs: 8200, hs: 113, wickets: 4, best: "2/25" },
  "Rohit Sharma": { matches: 257, runs: 6800, hs: 109, wickets: 11, best: "4/6" },
  "Shubman Gill": { matches: 95, runs: 3000, hs: 129, wickets: 0, best: "-" },
  "Suryakumar Yadav": { matches: 150, runs: 3594, hs: 103, wickets: 0, best: "-" },
  "Travis Head": { matches: 25, runs: 740, hs: 102, wickets: 2, best: "2/15" },
  "Yashasvi Jaiswal": { matches: 52, runs: 1607, hs: 124, wickets: 0, best: "-" },
  "Ruturaj Gaikwad": { matches: 66, runs: 2380, hs: 108, wickets: 0, best: "-" },
  "Shreyas Iyer": { matches: 115, runs: 3127, hs: 96, wickets: 0, best: "-" },
  "Abhishek Sharma": { matches: 63, runs: 1376, hs: 100, wickets: 9, best: "3/23" },
  "Rinku Singh": { matches: 45, runs: 893, hs: 67, wickets: 0, best: "-" },
  
  // FOREIGN BATSMEN
  "David Warner": { matches: 184, runs: 6565, hs: 126, wickets: 0, best: "-" },
  "Faf du Plessis": { matches: 145, runs: 4571, hs: 96, wickets: 0, best: "-" },
  "David Miller": { matches: 130, runs: 2850, hs: 101, wickets: 0, best: "-" },
  "Kane Williamson": { matches: 79, runs: 2128, hs: 89, wickets: 0, best: "-" },
  "Shimron Hetmyer": { matches: 73, runs: 1263, hs: 75, wickets: 0, best: "-" },
  "Rovman Powell": { matches: 38, runs: 928, hs: 76, wickets: 0, best: "-" },
  "Harry Brook": { matches: 12, runs: 337, hs: 65, wickets: 0, best: "-" },
  "Will Jacks": { matches: 10, runs: 230, hs: 55, wickets: 4, best: "2/18" },
  "Steve Smith": { matches: 18, runs: 626, hs: 78, wickets: 0, best: "-" },
  "Devon Conway": { matches: 24, runs: 802, hs: 99, wickets: 0, best: "-" },
  "Daryl Mitchell": { matches: 28, runs: 774, hs: 88, wickets: 2, best: "1/22" },
  "Jake Fraser-McGurk": { matches: 9, runs: 247, hs: 70, wickets: 0, best: "-" },
  "Dewald Brevis": { matches: 15, runs: 337, hs: 46, wickets: 0, best: "-" },
  "Tim David": { matches: 29, runs: 689, hs: 71, wickets: 0, best: "-" },
  "Aiden Markram": { matches: 22, runs: 648, hs: 82, wickets: 1, best: "1/25" },
  "Finn Allen": { matches: 18, runs: 512, hs: 77, wickets: 0, best: "-" },
  "Rilee Rossouw": { matches: 54, runs: 1496, hs: 100, wickets: 0, best: "-" },
  "Jason Roy": { matches: 37, runs: 1122, hs: 90, wickets: 0, best: "-" },
  
  // INDIAN BATSMEN
  "Shikhar Dhawan": { matches: 222, runs: 6769, hs: 106, wickets: 4, best: "1/7" },
  "Sai Sudharsan": { matches: 28, runs: 1126, hs: 103, wickets: 0, best: "-" },
  "Tilak Varma": { matches: 42, runs: 1281, hs: 108, wickets: 0, best: "-" },
  "Ajinkya Rahane": { matches: 182, runs: 4683, hs: 105, wickets: 8, best: "2/11" },
  "Prithvi Shaw": { matches: 31, runs: 953, hs: 82, wickets: 0, best: "-" },
  "Venkatesh Iyer": { matches: 26, runs: 675, hs: 104, wickets: 6, best: "2/20" },
  "Rajat Patidar": { matches: 22, runs: 833, hs: 112, wickets: 0, best: "-" },
  "Nitish Rana": { matches: 79, runs: 2500, hs: 97, wickets: 2, best: "1/15" },
  "Rahul Tripathi": { matches: 76, runs: 1926, hs: 99, wickets: 0, best: "-" },
  "Shivam Dube": { matches: 62, runs: 1414, hs: 95, wickets: 2, best: "1/12" },
  "Manish Pandey": { matches: 114, runs: 2959, hs: 93, wickets: 1, best: "1/18" },
  "Devdutt Padikkal": { matches: 26, runs: 792, hs: 89, wickets: 0, best: "-" },
  "Sameer Rizvi": { matches: 8, runs: 165, hs: 58, wickets: 0, best: "-" },
  "Nehal Wadhera": { matches: 13, runs: 428, hs: 68, wickets: 0, best: "-" },
  "Ayush Badoni": { matches: 29, runs: 512, hs: 59, wickets: 2, best: "1/6" },
  
  // MARQUEE WICKETKEEPERS
  "MS Dhoni": { matches: 264, runs: 5243, hs: 84, wickets: 0, best: "-" },
  "Rishabh Pant": { matches: 111, runs: 3100, hs: 128, wickets: 0, best: "-" },
  "Jos Buttler": { matches: 107, runs: 3582, hs: 124, wickets: 0, best: "-" },
  "Heinrich Klaasen": { matches: 35, runs: 993, hs: 104, wickets: 0, best: "-" },
  "Sanju Samson": { matches: 167, runs: 4419, hs: 119, wickets: 0, best: "-" },
  "KL Rahul": { matches: 132, runs: 4683, hs: 132, wickets: 0, best: "-" },
  "Nicholas Pooran": { matches: 76, runs: 1769, hs: 77, wickets: 0, best: "-" },
  "Quinton de Kock": { matches: 107, runs: 3157, hs: 140, wickets: 0, best: "-" },
  "Ishan Kishan": { matches: 105, runs: 2644, hs: 99, wickets: 0, best: "-" },
  "Phil Salt": { matches: 25, runs: 678, hs: 89, wickets: 0, best: "-" },
  
  // FOREIGN WICKETKEEPERS
  "Jonny Bairstow": { matches: 38, runs: 1158, hs: 99, wickets: 0, best: "-" },
  "Rahmanullah Gurbaz": { matches: 22, runs: 634, hs: 89, wickets: 0, best: "-" },
  "Josh Inglis": { matches: 18, runs: 482, hs: 72, wickets: 0, best: "-" },
  "Shai Hope": { matches: 15, runs: 412, hs: 78, wickets: 0, best: "-" },
  "Tristan Stubbs": { matches: 14, runs: 356, hs: 68, wickets: 0, best: "-" },
  "Ryan Rickelton": { matches: 8, runs: 189, hs: 55, wickets: 0, best: "-" },
  "Donovan Ferreira": { matches: 7, runs: 167, hs: 54, wickets: 0, best: "-" },
  
  // INDIAN WICKETKEEPERS
  "Dinesh Karthik": { matches: 257, runs: 4842, hs: 97, wickets: 0, best: "-" },
  "Jitesh Sharma": { matches: 38, runs: 794, hs: 82, wickets: 0, best: "-" },
  "Dhruv Jurel": { matches: 8, runs: 128, hs: 31, wickets: 0, best: "-" },
  "Wriddhiman Saha": { matches: 61, runs: 1328, hs: 87, wickets: 0, best: "-" },
  "Anuj Rawat": { matches: 17, runs: 372, hs: 61, wickets: 0, best: "-" },
  "Prabhsimran Singh": { matches: 25, runs: 658, hs: 91, wickets: 0, best: "-" },
  "KS Bharat": { matches: 12, runs: 156, hs: 33, wickets: 0, best: "-" },
  "Vishnu Vinod": { matches: 18, runs: 234, hs: 45, wickets: 0, best: "-" },
  "Abishek Porel": { matches: 11, runs: 278, hs: 62, wickets: 0, best: "-" },
  
  // MARQUEE ALL-ROUNDERS
  "Hardik Pandya": { matches: 137, runs: 2525, hs: 91, wickets: 55, best: "3/17" },
  "Ravindra Jadeja": { matches: 240, runs: 2959, hs: 62, wickets: 155, best: "5/16" },
  "Andre Russell": { matches: 126, runs: 2484, hs: 88, wickets: 95, best: "5/15" },
  "Glenn Maxwell": { matches: 134, runs: 2771, hs: 95, wickets: 37, best: "2/15" },
  "Sunil Narine": { matches: 176, runs: 1534, hs: 109, wickets: 180, best: "5/19" },
  "Axar Patel": { matches: 150, runs: 1653, hs: 66, wickets: 123, best: "5/21" },
  "Cameron Green": { matches: 29, runs: 681, hs: 100, wickets: 16, best: "2/14" },
  "Sam Curran": { matches: 59, runs: 883, hs: 63, wickets: 58, best: "3/19" },
  "Marcus Stoinis": { matches: 96, runs: 1866, hs: 124, wickets: 43, best: "4/15" },
  
  // FOREIGN ALL-ROUNDERS
  "Liam Livingstone": { matches: 39, runs: 911, hs: 94, wickets: 11, best: "2/25" },
  "Moeen Ali": { matches: 67, runs: 1162, hs: 93, wickets: 35, best: "4/26" },
  "Mitchell Marsh": { matches: 22, runs: 638, hs: 96, wickets: 14, best: "3/21" },
  "Rachin Ravindra": { matches: 15, runs: 412, hs: 68, wickets: 12, best: "3/19" },
  "Azmatullah Omarzai": { matches: 12, runs: 289, hs: 52, wickets: 15, best: "3/17" },
  "Romario Shepherd": { matches: 18, runs: 345, hs: 58, wickets: 21, best: "3/24" },
  "Mohammad Nabi": { matches: 42, runs: 678, hs: 75, wickets: 38, best: "4/21" },
  "Jason Holder": { matches: 38, runs: 512, hs: 64, wickets: 45, best: "3/27" },
  "Chris Woakes": { matches: 16, runs: 234, hs: 42, wickets: 18, best: "3/20" },
  "Daniel Sams": { matches: 22, runs: 312, hs: 48, wickets: 28, best: "3/22" },
  "Kyle Mayers": { matches: 17, runs: 398, hs: 73, wickets: 15, best: "2/19" },
  "Sikandar Raza": { matches: 14, runs: 289, hs: 65, wickets: 12, best: "3/15" },
  
  // INDIAN ALL-ROUNDERS
  "Krunal Pandya": { matches: 68, runs: 628, hs: 43, wickets: 72, best: "4/15" },
  "Deepak Hooda": { matches: 67, runs: 1490, hs: 73, wickets: 25, best: "3/14" },
  "Rahul Tewatia": { matches: 79, runs: 846, hs: 45, wickets: 76, best: "4/18" },
  "Vijay Shankar": { matches: 60, runs: 974, hs: 63, wickets: 25, best: "2/12" },
  "Riyan Parag": { matches: 39, runs: 674, hs: 76, wickets: 3, best: "1/10" },
  "Shahrukh Khan": { matches: 26, runs: 354, hs: 42, wickets: 4, best: "2/13" },
  "Shahbaz Ahmed": { matches: 28, runs: 234, hs: 31, wickets: 20, best: "3/22" },
  "Ramandeep Singh": { matches: 15, runs: 298, hs: 58, wickets: 8, best: "2/18" },
  "Lalit Yadav": { matches: 21, runs: 412, hs: 48, wickets: 16, best: "2/13" },
  "Nitish Kumar Reddy": { matches: 9, runs: 178, hs: 45, wickets: 7, best: "2/21" },
  
  // MARQUEE BOWLERS
  "Jasprit Bumrah": { matches: 133, runs: 69, hs: 16, wickets: 165, best: "5/10" },
  "Mitchell Starc": { matches: 38, runs: 135, hs: 29, wickets: 51, best: "4/15" },
  "Pat Cummins": { matches: 58, runs: 510, hs: 66, wickets: 63, best: "4/34" },
  "Mohammed Shami": { matches: 110, runs: 126, hs: 21, wickets: 127, best: "4/11" },
  "Rashid Khan": { matches: 121, runs: 545, hs: 79, wickets: 149, best: "4/24" },
  "Trent Boult": { matches: 104, runs: 79, hs: 16, wickets: 121, best: "4/18" },
  "Kagiso Rabada": { matches: 80, runs: 206, hs: 25, wickets: 117, best: "4/21" },
  "Yuzvendra Chahal": { matches: 160, runs: 37, hs: 8, wickets: 190, best: "5/40" },
  "Mohammed Siraj": { matches: 93, runs: 109, hs: 14, wickets: 93, best: "4/21" },
  "Arshdeep Singh": { matches: 65, runs: 27, hs: 10, wickets: 76, best: "5/32" },
  "Kuldeep Yadav": { matches: 84, runs: 161, hs: 28, wickets: 88, best: "4/14" },
  "Matheesha Pathirana": { matches: 18, runs: 12, hs: 5, wickets: 28, best: "4/28" },
  
  // FOREIGN FAST BOWLERS
  "Anrich Nortje": { matches: 28, runs: 67, hs: 12, wickets: 34, best: "3/33" },
  "Josh Hazlewood": { matches: 32, runs: 89, hs: 18, wickets: 41, best: "4/26" },
  "Jofra Archer": { matches: 35, runs: 78, hs: 27, wickets: 46, best: "3/15" },
  "Mark Wood": { matches: 17, runs: 45, hs: 14, wickets: 22, best: "3/23" },
  "Lockie Ferguson": { matches: 46, runs: 92, hs: 19, wickets: 61, best: "4/28" },
  "Gerald Coetzee": { matches: 8, runs: 23, hs: 12, wickets: 12, best: "3/32" },
  "Marco Jansen": { matches: 17, runs: 156, hs: 32, wickets: 19, best: "3/25" },
  "Spencer Johnson": { matches: 11, runs: 34, hs: 11, wickets: 15, best: "3/29" },
  "Alzarri Joseph": { matches: 42, runs: 178, hs: 27, wickets: 54, best: "4/12" },
  "Dilshan Madushanka": { matches: 7, runs: 18, hs: 9, wickets: 10, best: "2/28" },
  "Nuwan Thushara": { matches: 9, runs: 21, hs: 8, wickets: 13, best: "3/26" },
  "Mustafizur Rahman": { matches: 44, runs: 56, hs: 12, wickets: 48, best: "3/16" },
  "Fazalhaq Farooqi": { matches: 14, runs: 34, hs: 11, wickets: 18, best: "3/22" },
  "Nathan Ellis": { matches: 13, runs: 28, hs: 10, wickets: 17, best: "3/24" },
  "Naveen-ul-Haq": { matches: 32, runs: 67, hs: 15, wickets: 42, best: "4/19" },
  "Kwena Maphaka": { matches: 2, runs: 0, hs: 0, wickets: 1, best: "1/66" },
  
  // INDIAN FAST BOWLERS
  "Bhuvneshwar Kumar": { matches: 176, runs: 324, hs: 25, wickets: 181, best: "5/19" },
  "Deepak Chahar": { matches: 58, runs: 159, hs: 39, wickets: 65, best: "4/13" },
  "Shardul Thakur": { matches: 85, runs: 751, hs: 45, wickets: 84, best: "3/27" },
  "T Natarajan": { matches: 61, runs: 3, hs: 1, wickets: 67, best: "4/19" },
  "Mohit Sharma": { matches: 141, runs: 642, hs: 37, wickets: 166, best: "5/10" },
  "Umesh Yadav": { matches: 124, runs: 394, hs: 48, wickets: 127, best: "4/24" },
  "Prasidh Krishna": { matches: 26, runs: 52, hs: 7, wickets: 30, best: "4/30" },
  "Avesh Khan": { matches: 32, runs: 89, hs: 15, wickets: 38, best: "4/24" },
  "Harshal Patel": { matches: 105, runs: 298, hs: 36, wickets: 135, best: "5/27" },
  "Khaleel Ahmed": { matches: 48, runs: 93, hs: 17, wickets: 51, best: "3/22" },
  "Mukesh Kumar": { matches: 14, runs: 28, hs: 9, wickets: 18, best: "3/21" },
  "Ishant Sharma": { matches: 15, runs: 45, hs: 12, wickets: 16, best: "2/18" },
  "Umran Malik": { matches: 20, runs: 23, hs: 6, wickets: 22, best: "2/19" },
  "Harshit Rana": { matches: 11, runs: 34, hs: 15, wickets: 15, best: "3/26" },
  "Akash Deep": { matches: 9, runs: 18, hs: 7, wickets: 12, best: "2/24" },
  "Yash Dayal": { matches: 14, runs: 23, hs: 8, wickets: 17, best: "3/20" },
  "Mayank Yadav": { matches: 4, runs: 8, hs: 5, wickets: 7, best: "3/27" },
  
  // FOREIGN SPINNERS
  "Wanindu Hasaranga": { matches: 28, runs: 89, hs: 22, wickets: 32, best: "3/18" },
  "Maheesh Theekshana": { matches: 21, runs: 45, hs: 13, wickets: 28, best: "4/27" },
  "Adam Zampa": { matches: 38, runs: 67, hs: 15, wickets: 48, best: "3/20" },
  "Mujeeb Ur Rahman": { matches: 32, runs: 34, hs: 11, wickets: 42, best: "4/21" },
  "Noor Ahmad": { matches: 16, runs: 28, hs: 9, wickets: 22, best: "3/19" },
  "Mitchell Santner": { matches: 26, runs: 178, hs: 34, wickets: 28, best: "3/16" },
  "Keshav Maharaj": { matches: 18, runs: 89, hs: 21, wickets: 24, best: "3/25" },
  "Adil Rashid": { matches: 14, runs: 45, hs: 12, wickets: 18, best: "2/22" },
  "Tabraiz Shamsi": { matches: 22, runs: 34, hs: 10, wickets: 28, best: "3/15" },
  "Allah Ghazanfar": { matches: 6, runs: 12, hs: 7, wickets: 9, best: "2/18" },
  
  // INDIAN SPINNERS
  "Ravichandran Ashwin": { matches: 23, runs: 92, hs: 20, wickets: 15, best: "2/19" },
  "Ravi Bishnoi": { matches: 40, runs: 28, hs: 8, wickets: 46, best: "3/22" },
  "Varun Chakravarthy": { matches: 70, runs: 26, hs: 10, wickets: 83, best: "5/20" },
  "Washington Sundar": { matches: 35, runs: 178, hs: 35, wickets: 29, best: "2/14" },
  "Rahul Chahar": { matches: 35, runs: 23, hs: 8, wickets: 37, best: "4/27" },
  "Amit Mishra": { matches: 154, runs: 421, hs: 36, wickets: 172, best: "5/17" },
  "Piyush Chawla": { matches: 194, runs: 671, hs: 32, wickets: 192, best: "4/17" },
  "Karn Sharma": { matches: 38, runs: 89, hs: 22, wickets: 42, best: "3/19" },
  "Mayank Markande": { matches: 18, runs: 34, hs: 12, wickets: 24, best: "3/23" },
  "R Sai Kishore": { matches: 9, runs: 18, hs: 9, wickets: 12, best: "2/21" },
  "Suyash Sharma": { matches: 7, runs: 12, hs: 6, wickets: 9, best: "2/28" },
  
  // DOMESTIC BATSMEN
  "Vaibhav Suryavanshi": { matches: 5, runs: 156, hs: 67, wickets: 0, best: "-" },
  "Priyansh Arya": { matches: 7, runs: 234, hs: 81, wickets: 0, best: "-" },
  "Angkrish Raghuvanshi": { matches: 6, runs: 189, hs: 72, wickets: 0, best: "-" },
  "Ashutosh Sharma": { matches: 12, runs: 367, hs: 61, wickets: 0, best: "-" },
  "Naman Dhir": { matches: 9, runs: 245, hs: 52, wickets: 1, best: "1/15" },
  "Ayush Mhatre": { matches: 4, runs: 112, hs: 48, wickets: 0, best: "-" },
  "Yash Dhull": { matches: 8, runs: 289, hs: 88, wickets: 0, best: "-" },
  "Sarfaraz Khan": { matches: 15, runs: 512, hs: 94, wickets: 0, best: "-" },
  "Musheer Khan": { matches: 6, runs: 178, hs: 65, wickets: 0, best: "-" },
  "Shashank Singh": { matches: 14, runs: 423, hs: 69, wickets: 0, best: "-" },
  "Abdul Samad": { matches: 56, runs: 978, hs: 75, wickets: 0, best: "-" },
  "Swastik Chikara": { matches: 5, runs: 98, hs: 34, wickets: 0, best: "-" },
  "Andre Siddarth": { matches: 6, runs: 134, hs: 42, wickets: 0, best: "-" },
  "Aniket Verma": { matches: 7, runs: 156, hs: 51, wickets: 0, best: "-" },
  
  // DOMESTIC BOWLERS
  "Akash Madhwal": { matches: 11, runs: 34, hs: 12, wickets: 18, best: "3/21" },
  "Vidwath Kaverappa": { matches: 8, runs: 21, hs: 9, wickets: 11, best: "2/26" },
  "Tushar Deshpande": { matches: 22, runs: 89, hs: 24, wickets: 29, best: "4/28" },
  "Vaibhav Arora": { matches: 16, runs: 45, hs: 13, wickets: 21, best: "3/24" },
  "Yash Thakur": { matches: 12, runs: 28, hs: 11, wickets: 16, best: "3/27" },
  "Kartik Tyagi": { matches: 14, runs: 23, hs: 8, wickets: 18, best: "3/20" },
  "Chetan Sakariya": { matches: 15, runs: 34, hs: 12, wickets: 19, best: "3/15" },
  "Simarjeet Singh": { matches: 9, runs: 18, hs: 7, wickets: 12, best: "2/22" },
  "Manimaran Siddharth": { matches: 11, runs: 23, hs: 10, wickets: 14, best: "3/18" },
  "Arjun Tendulkar": { matches: 7, runs: 34, hs: 15, wickets: 8, best: "2/21" },
  "Rasikh Salam": { matches: 8, runs: 21, hs: 9, wickets: 11, best: "2/25" },
  "Mohsin Khan": { matches: 14, runs: 28, hs: 10, wickets: 18, best: "3/23" },
  "Digvesh Rathi": { matches: 6, runs: 15, hs: 8, wickets: 8, best: "2/19" },
  "Ashwani Kumar": { matches: 7, runs: 18, hs: 9, wickets: 9, best: "2/24" },
  
  // DOMESTIC WICKETKEEPERS
  "Robin Minz": { matches: 7, runs: 198, hs: 55, wickets: 0, best: "-" },
  "Urvil Patel": { matches: 11, runs: 312, hs: 78, wickets: 0, best: "-" },
  "Kumar Kushagra": { matches: 9, runs: 245, hs: 67, wickets: 0, best: "-" },
  "Avanish Aravelly": { matches: 6, runs: 156, hs: 52, wickets: 0, best: "-" },
  "Luvnith Sisodia": { matches: 8, runs: 189, hs: 58, wickets: 0, best: "-" },
  
  // DOMESTIC ALL-ROUNDERS
  "Suryansh Shedge": { matches: 5, runs: 123, hs: 48, wickets: 3, best: "2/19" },
  "Vipraj Nigam": { matches: 6, runs: 145, hs: 52, wickets: 5, best: "2/21" },
  "Prashant Veer": { matches: 7, runs: 167, hs: 45, wickets: 6, best: "2/18" },
  "Tanush Kotian": { matches: 9, runs: 198, hs: 58, wickets: 11, best: "3/20" },
  "Arshin Kulkarni": { matches: 8, runs: 234, hs: 61, wickets: 7, best: "2/23" },
};

if (typeof module !== "undefined") {
  module.exports = { PLAYER_STATS, getPlayerCareerStats };
}

// HELPER: To ensure your simulation never crashes if a player is missing
function getPlayerCareerStats(playerName) {
    // 1. Try exact match
    if (PLAYER_STATS[playerName]) return PLAYER_STATS[playerName];

    // 2. Try case-insensitive match
    const lowerName = playerName.toLowerCase();
    const key = Object.keys(PLAYER_STATS).find(k => k.toLowerCase() === lowerName);
    if (key) return PLAYER_STATS[key];

    // 3. Fallback
    return { 
        matches: 0, runs: 0, hs: 0, wickets: 0, best: "-", note: "Generic Stats" 
    };
}