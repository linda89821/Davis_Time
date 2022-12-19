var courses = [];
var classes = [''];
var professors = [''];
var subjs = [''];
var class_prof = [];
var checker = new Set([]);
var mychart;
var years = ['16-17', '17-18', '18-19', '19-20', '20-21'];
var xArray = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"];
var yArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var grade = 0.0;
var enrolled = 0;
var layout;
var prof_name; 
function read(path, index) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', path, true);
    xhr.responseType = 'blob';
    xhr.addEventListener('load', () => {
        if (xhr.status == 200){
            const reader = new FileReader();
            reader.onload = function () {
                var year = years[index];
                const myArray = reader.result.split('\n');
                var crn, subj, crse, section, term, units, gpa, prof_name, enrolled, count_grade, title;
                for (var i = 1; i < myArray.length; i++) {
                    if (myArray[i].split(',')[0] != undefined){
                        crn = parseInt(myArray[i].split(',')[0].replace('\"', '').replace('\"', ''));
                    }
                    if (myArray[i].split(',')[1] != undefined){
                        subj = myArray[i].split(',')[1].replace('\"', '').replace('\"', '');
                    }
                    if (myArray[i].split(',')[2] != undefined){
                        crse = myArray[i].split(',')[2].replace('\"', '').replace('\"', '');
                    }
                    if (myArray[i].split(',')[3] != undefined){
                        section = myArray[i].split(',')[3].replace('\"', '').replace('\"', '');
                    }
                    if (myArray[i].split(',')[4] != undefined){
                        term = myArray[i].split(',')[4].replace('\"', '').replace('\"', '');
                    }
                    if (myArray[i].split(',')[5] != undefined){
                        units = parseInt(myArray[i].split(',')[5].replace('\"', '').replace('\"', ''));
                    }
                    if (myArray[i].split(',')[6] != undefined){
                        gpa = myArray[i].split(',')[6].replace('\"', '').replace('\"', '');
                    }
                    if (myArray[i].split(',')[7] != undefined){
                        title = myArray[i].split(',')[7].replace('\"', '').replace('\"', '');
                    }
                    if (myArray[i].split(',')[8] != undefined){
                        prof_name = myArray[i].split(',')[9].replace('\"', '').replace('\"', '')+' '+myArray[i].split(',')[8].replace('\"', '').replace('\"', '');
                    }
                    if (myArray[i].split(',')[11] != undefined){
                        enrolled = parseInt(myArray[i].split(',')[11].replace('\"', '').replace('\"', ''));
                    }
                    if (myArray[i].split(',')[12] != undefined){
                        count_grade = parseInt(myArray[i].split(',')[12].replace('\"', '').replace('\"', '').replace('\r', ''));
                    }
                    if(classes.includes(title) == false){
                        classes.push(title);
                    }
                    if(professors.includes(prof_name) == false){
                        professors.push(prof_name);
                    }
                    if(subjs.includes(subj) == false){
                        subjs.push(subj);
                    }
                    //title = myArray.replace(crn, '').replace(subj, '').replace(crse, '').replace(section, '').replace(term, '').replace(units, '').replace(gpa, '').replace(prof_name, '').replace(enrolled, '').replace(count_grade, '');
                    //console.log(myArray[i]-subj-crse-term);
                    var cur_title_prof = [title, prof_name, subj]
                    if (checker.has(title+prof_name+subj) == false){
                        class_prof.push(cur_title_prof);
                        checker.add(title+prof_name+subj);
                    }
                    const course = {
                        CRN: crn,
                        SUBJ: subj,
                        CRSE: crse,
                        SECTION: section,
                        TERM: term,
                        UNITS: units,
                        GRADE: gpa,
                        CRSE_TITLE: title,
                        PROF_NAME: prof_name,
                        ENROLLED: enrolled,
                        CNTOFGRADE: count_grade,
                        YEAR: year,
                    }
                    if (course.CRN != '' && i != 0) {
                        courses.push(course);
                    }
                }
            }
            reader.readAsText(xhr.response);
            
            if (courses.length > 0){
                createButtons(classes, subjs, professors);
                clickSelection(classes, subjs, professors);
                var select_class = document.getElementById('classes');
                var select_prof = document.getElementById('professors');
                var select_subj = document.getElementById('subj'); 
                clickBtn(classes, subjs, professors, select_class, select_prof, select_subj);
                let submitBtn = document.getElementById('submit');
                submitBtn.addEventListener('click', () => {calculate_gpa(courses)});
            } 
            else{
                setTimeout(read('./dr_6099_ay16-17.csv'), 300);
            }
        }
    });
    xhr.send();
} 
//, './dr_6099_ay17-18.csv', './dr_6099_ay18-19.csv', './dr_6099_ay19-20.csv', './dr_6099_ay20-21.csv'
//var paths = ['./dr_6099_ay16-17.csv'];
var paths = ['./dr_6099_ay16-17.csv', './dr_6099_ay17-18.csv', './dr_6099_ay18-19.csv', './dr_6099_ay19-20.csv', './dr_6099_ay20-21.csv'];
for (var i = 0; i < paths.length; i++) {
    read(paths[i], i);
}
//var path = './dr_6099_ay16-17.csv';
//read(path);
//console.log(courses);

function createButtons(classes, subjs, professors){
    // var select_class = document.getElementById('classes');
    // var select_prof = document.getElementById('professors');
    var select_subj = document.getElementById('subj'); 

    // for (var i = 0; i < classes.length; i++) {
    //     var opt = document.createElement('option');
    //     opt.value = classes[i];
    //     opt.innerHTML = classes[i];
    //     select_class.appendChild(opt);
    // }
    // for (var i = 0; i < professors.length; i++) {
    //     var opt = document.createElement('option');
    //     opt.value = professors[i];
    //     opt.innerHTML = professors[i];
    //     select_prof.appendChild(opt);
    // }
    for (var i = 0; i < subjs.length; i++) {
        var opt = document.createElement('option');
        opt.value = subjs[i];
        opt.innerHTML = subjs[i];
        select_subj.appendChild(opt);
    }
}
function clickSelection(classes, subjs, professors){
    //console.log(class_prof[0]);
    var select_class = document.getElementById('classes');
    var select_prof = document.getElementById('professors');
    var select_subj = document.getElementById('subj');
    //var select_year = document.getElementById('year');

    //var year_submit = document.getElementById('year_submit');
    var sub_submit = document.getElementById('subj_submit');
    var class_submit = document.getElementById('class_submit');
    var prof_submit = document.getElementById('prof_submit');
    
    // year_submit.addEventListener('click', () => {
    //     //console.log('hi');
    //     while (select_prof.length > 0) {
    //         select_prof.remove(0);
    //     }
    //     while (select_class.length > 0) {
    //         select_class.remove(0);
    //     }
    //     for (var i = 0; i < class_prof.length; i++) {
    //         if (class_prof[i][3] == select_year.value) {
    //             var opt_prof = document.createElement('option');
    //             opt_prof.value = class_prof[i][1];
    //             opt_prof.innerHTML = class_prof[i][1];
    //             var opt_class = document.createElement('option');
    //             opt_class.value = class_prof[i][0];
    //             opt_class.innerHTML = class_prof[i][0];

    //             select_prof.appendChild(opt_prof);
    //             select_class.appendChild(opt_class);
    //         }
    //     }
    // });

    sub_submit.addEventListener('click', () => {
        document.getElementById('advance_search').style.display = 'block';
        while (select_prof.length > 0) {
            select_prof.remove(0);
        }
        while (select_class.length > 0) {
            select_class.remove(0);
        }
        for (var i = 0; i < class_prof.length; i++) {
            if (class_prof[i][2] == select_subj.value) {
                var opt_prof = document.createElement('option');
                opt_prof.value = class_prof[i][1];
                opt_prof.innerHTML = class_prof[i][1];
                var opt_class = document.createElement('option');
                opt_class.value = class_prof[i][0];
                opt_class.innerHTML = class_prof[i][0];

                select_prof.appendChild(opt_prof);
                select_class.appendChild(opt_class);
            }
        }
    });

    class_submit.addEventListener('click', () => {
        while (select_prof.length > 0) {
            select_prof.remove(0);
        }
        for (var i = 0; i < class_prof.length; i++) {
            if (class_prof[i][0] == select_class.value) {
                var opt_prof = document.createElement('option');
                opt_prof.value = class_prof[i][1];
                opt_prof.innerHTML = class_prof[i][1];
                select_prof.appendChild(opt_prof);
            }
        }
    });
    prof_submit.addEventListener('click', () => {
        while (select_class.length > 0) {
            select_class.remove(0);
        }
        for (var i = 0; i < class_prof.length; i++) {
            if (class_prof[i][1] == select_prof.value) {
                var opt_class = document.createElement('option');
                opt_class.value = class_prof[i][0];
                opt_class.innerHTML = class_prof[i][0];
                select_class.appendChild(opt_class);
            }
        }
    });
}
  
function clickBtn(classes, subjs, professors, select_class, select_prof, select_subj){
    var reset = document.getElementById('reset');
    reset.addEventListener('click', () => {
        while (select_prof.length > 0) {
            select_prof.remove(0);
        }
        while (select_class.length > 0) {
            select_class.remove(0);
        }
        document.getElementById('advance_search').style.display = 'none';
        // while (select_subj.length > 0) {
        //     select_subj.remove(0);
        // }
        // for (var i = 0; i < classes.length; i++) {
        //     var opt = document.createElement('option');
        //     opt.value = classes[i];
        //     opt.innerHTML = classes[i];
        //     select_class.appendChild(opt);
        // }
        // for (var i = 0; i < professors.length; i++) {
        //     var opt = document.createElement('option');
        //     opt.value = professors[i];
        //     opt.innerHTML = professors[i];
        //     select_prof.appendChild(opt);
        // }
        // for (var i = 0; i < subjs.length; i++) {
        //     var opt = document.createElement('option');
        //     opt.value = subjs[i];
        //     opt.innerHTML = subjs[i];
        //     select_subj.appendChild(opt);
        // }
        if (mychart != undefined) {
            mychart.destroy();
        }
    })
}
function calculate_gpa(courses){
    var classmenu = document.getElementById('classes');
    var profmenu = document.getElementById('professors');
    var year_menu = document.getElementById('year');
    grade = 0;
    enrolled = 0;
    for (var i = 0; i < courses.length; i++) {
        //console.log('year: ', courses[i].YEAR);
        if (courses[i].CRSE_TITLE == classmenu.value && courses[i].PROF_NAME == profmenu.value && courses[i].YEAR == year_menu.value) {
            layout = courses[i].CRSE_TITLE;
            enrolled += courses[i].CNTOFGRADE;
            prof_name = courses[i].PROF_NAME;
            //console.log('count: ', courses[i].CNTOFGRADE);
            if (courses[i].GRADE == 'A') {
                grade += 4.0 * courses[i].CNTOFGRADE;
                yArray[1] = courses[i].CNTOFGRADE;
            }
            else if (courses[i].GRADE == 'A+') {
                grade += 4.0 * courses[i].CNTOFGRADE;
                yArray[0] = courses[i].CNTOFGRADE;
            }
            else if (courses[i].GRADE == 'A-') {
                grade += 3.7 * courses[i].CNTOFGRADE;
                yArray[2] = courses[i].CNTOFGRADE;
            }
            else if (courses[i].GRADE == 'B+') {
                grade += 3.3 * courses[i].CNTOFGRADE;
                yArray[3] = courses[i].CNTOFGRADE;
            }
            else if (courses[i].GRADE == 'B') {
                grade += 3.0 * courses[i].CNTOFGRADE;
                yArray[4] = courses[i].CNTOFGRADE;
            }
            else if (courses[i].GRADE == 'B-') {
                grade += 2.7 * courses[i].CNTOFGRADE;
                yArray[5] = courses[i].CNTOFGRADE;
            }
            else if (courses[i].GRADE == 'C+') {
                grade += 2.3 * courses[i].CNTOFGRADE;
                yArray[6] = courses[i].CNTOFGRADE;
            }
            else if (courses[i].GRADE == 'C') {
                grade += 2.0 * courses[i].CNTOFGRADE;
                yArray[7] = courses[i].CNTOFGRADE;
            }
            else if (courses[i].GRADE == 'C-') {
                grade += 1.7 * courses[i].CNTOFGRADE;
                yArray[8] = courses[i].CNTOFGRADE;
            }
            else if (courses[i].GRADE == 'D+') {
                grade += 1.3 * courses[i].CNTOFGRADE;
                yArray[9] = courses[i].CNTOFGRADE;
            }
            else if (courses[i].GRADE == 'D') {
                grade += 1.0 * courses[i].CNTOFGRADE;
                yArray[10] = courses[i].CNTOFGRADE;
            }
            else if (courses[i].GRADE == 'D-') {
                grade += 0.7 * courses[i].CNTOFGRADE;
                yArray[11] = courses[i].CNTOFGRADE;
            }
        }
    }
    if (mychart != undefined) {
        mychart.destroy();
    }
    if (grade != 0 && enrolled != 0){
        draw(grade, enrolled, xArray, yArray, layout, prof_name, year_menu.value);
    }
    else{
        document.querySelector('p').innerHTML = 'No such evaluation available.';
    }
}
function draw(grade, enrolled, xArray, yArray, layout, prof_name, year) {
    console.log(grade, enrolled);
    document.querySelector('p').innerHTML = 'year: '+year+'<br><br>Average GPA: '+(grade/enrolled).toFixed(2);
    grade = 0;
    enrolled = 0;
    var barColors = [];
    for (var i = 0; i < 11; i++) {
        barColors.push('lightblue');
    }
    mychart = new Chart("myChart", {
        type: "bar",
        data: {
            labels: xArray,
            datasets: [{
                backgroundColor: barColors,
                data: yArray
            }]
        },
        options: {
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: layout,
                    position: "top"
                },
                subtitle: {
                    display: true,
                    text: prof_name,
                    position: "bottom"
                }
            }
        }
    });
}             
