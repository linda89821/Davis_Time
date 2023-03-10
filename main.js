var courses = [];
var classes = [''];
var professors = [''];
var subjs = [''];
var class_set = new Set([]);
var prof_set = new Set([]);
var subj_set = new Set([]);

var class_prof = [];
var class_subj = [];
var prof_subj = [];
var checker_class = new Set([]);
var checker_prof = new Set([]);
var checker = new Set([]);
var mychart;
var years = ['16-17', '17-18', '18-19', '19-20', '20-21'];
var xArray = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"];
var grade = 0.0;
var enrolled = 0;
var layout;
var prof_name; 
function read(path, index) {
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', path, true);
        xhr.responseType = 'blob';
        xhr.addEventListener('load', () => {
            if (xhr.status == 200) {
                const reader = new FileReader();
                reader.onload = function () {
                    resolve(reader.result);
                }
                reader.onerror = function(){
                    reject(reader);
                };
                reader.readAsText(xhr.response);
            }
        });
        xhr.send();
    });
} 

var paths = ['./dr_6099_ay16-17.csv', './dr_6099_ay17-18.csv', './dr_6099_ay18-19.csv', './dr_6099_ay19-20.csv', './dr_6099_ay20-21.csv'];
let readers = [];
for(let i = 0;i < paths.length;i++){
    readers.push(read(paths[i]));
}

// Trigger Promises
Promise.all(readers).then((values) => {
    // Values will be an array that contains an item
    // with the text of every selected file
    // ["File1 Content", "File2 Content" ... "FileN Content"]
    // console.log(values.length);
    for (var i = 0; i < values.length; i++) {
        put_data_from_csv(values[i], i);
    }
    class_prof.sort();
    prof_subj.sort();
    class_subj.sort();
    subjs.sort();
    createButtons(classes, subjs, professors);
    clickSelection(classes, subjs, professors);
    var select_class = document.getElementById('classes');
    var select_prof = document.getElementById('professors');
    var select_subj = document.getElementById('subj');
    clickBtn(classes, subjs, professors, select_class, select_prof, select_subj);
    let submitBtn = document.getElementById('submit');
    submitBtn.addEventListener('click', () => { calculate_gpa(courses) });
});


function put_data_from_csv(data, index){
    var year = years[index];
    const myArray = data.split('\n');
    var crn, subj, crse, section, term, units, gpa, prof_name, enrolled, count_grade, title, year_term;
    for (var i = 1; i < myArray.length; i++) {
        if (myArray[i].split(';')[0] != undefined) {
            crn = parseInt(myArray[i].split(';')[0]);
        }
        if (myArray[i].split(';')[1] != undefined) {
            subj = myArray[i].split(';')[1];
        }
        if (myArray[i].split(';')[2] != undefined) {
            crse = myArray[i].split(';')[2];
        }
        if (myArray[i].split(';')[3] != undefined) {
            section = myArray[i].split(';')[3];
        }
        if (myArray[i].split(';')[4] != undefined) {
            year_term = myArray[i].split(';')[4].substring(0,4);
            term = myArray[i].split(';')[4].substring(4,6);
            //console.log(term);
            if (term == '01' || term == '02' || term == '03'){
                term = 'Winter';
            }
            else if (term == '04' || term == '05' || term == '06'){
                term = 'Spring';
            }
            else if (term == '07' || term == '08'){
                term = 'Summer';
            }
            else if (term == '09' || term == '10' || term == '11' || term == '12'){
                term = 'Fall';
            }
        }
        if (myArray[i].split(';')[5] != undefined) {
            units = parseInt(myArray[i].split(';')[5]);
        }
        if (myArray[i].split(';')[6] != undefined) {
            gpa = myArray[i].split(';')[6];
        }
        if (myArray[i].split(';')[7] != undefined) {
            title = myArray[i].split(';')[7];
        }
        if (myArray[i].split(';')[8] != undefined) {
            prof_name = myArray[i].split(';')[9] + ' ' + myArray[i].split(';')[8];
        }
        if (myArray[i].split(';')[11] != undefined) {
            enrolled = parseInt(myArray[i].split(';')[11]);
        }
        if (myArray[i].split(';')[12] != undefined) {
            count_grade = parseInt(myArray[i].split(';')[12].replace('\r', ''));
        }
        if (class_set.has(title+year) == false) {
            classes.push([title, year]);
            class_set.add(title+year);
        }
        if (prof_set.has(prof_name+year) == false) {
            professors.push([prof_name, year]);
            prof_set.add(prof_name+year);
        }
        if (subj_set.has(subj) == false) {
            subjs.push(subj);
            subj_set.add(subj);
        }
        var cur_title_prof = [title, prof_name, subj, year, term]
        if (checker.has(title + prof_name + subj + year + term) == false) {
            class_prof.push(cur_title_prof);
            checker.add(title + prof_name + subj + year + term);
        }
        var cur_title = [title, subj, year, term]
        if (checker_class.has(title + subj + year + term) == false) {
            class_subj.push(cur_title);
            checker_class.add(title + subj + year + term);
        }
        var cur_prof = [prof_name, subj, year, term]
        if (checker_prof.has(prof_name + subj + year + term) == false) {
            prof_subj.push(cur_prof);
            checker_prof.add(prof_name + subj + year + term);
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
            YEAR_TERM: year_term,
        }
        if (course.CRN != '' && i != 0) {
            courses.push(course);
        }
    }
}

function createButtons(classes, subjs, professors){
    var select_subj = document.getElementById('subj'); 
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
    var select_year = document.getElementById('year');
    var select_term = document.getElementById('term');

    var sub_submit = document.getElementById('subj_submit');
    var class_submit = document.getElementById('class_submit');
    var prof_submit = document.getElementById('prof_submit');

    sub_submit.addEventListener('click', () => {
        while (select_prof.length > 0) {
            select_prof.remove(0);
        }
        while (select_class.length > 0) {
            select_class.remove(0);
        }
        for (var i = 0; i < prof_subj.length; i++) {
            if (prof_subj[i][1] == select_subj.value && prof_subj[i][2] == select_year.value && prof_subj[i][3] == select_term.value) {
                //console.log(prof_subj[i][0]);
                var opt_prof = document.createElement('option');
                opt_prof.value = prof_subj[i][0];
                opt_prof.innerHTML = prof_subj[i][0];
                select_prof.appendChild(opt_prof);
            }
        }
        for (var i = 0; i < class_subj.length; i++) {
            if (class_subj[i][1] == select_subj.value && class_subj[i][2] == select_year.value && class_subj[i][3] == select_term.value) {
                var opt_class = document.createElement('option');
                opt_class.value = class_subj[i][0];
                opt_class.innerHTML = class_subj[i][0];
                select_class.appendChild(opt_class);
            }
        }
        if (document.getElementById('classes').length != 0 || document.getElementById('professors').length != 0){
            document.getElementById('advance_search').style.display = 'block';
        }
        else{
            document.getElementById('advance_search').style.display = 'none';
            document.querySelector('p').innerHTML = 'No such evaluation available.';
        }
    });

    class_submit.addEventListener('click', () => {
        while (select_prof.length > 0) {
            select_prof.remove(0);
        }
        for (var i = 0; i < class_prof.length; i++) {
            if (class_prof[i][0] == select_class.value && class_prof[i][2] == select_subj.value && class_prof[i][3] == select_year.value  && class_prof[i][4] == select_term.value) {
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
            if (class_prof[i][1] == select_prof.value && class_prof[i][2] == select_subj.value && class_prof[i][3] == select_year.value&& class_prof[i][3] == select_year.value && class_prof[i][4] == select_term.value) {
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
        document.querySelector('p').innerHTML = '';
        document.getElementById('subj_submit').selectedIndex = 0;
        while (select_prof.length > 0) {
            select_prof.remove(0);
        }
        while (select_class.length > 0) {
            select_class.remove(0);
        }
        document.getElementById('advance_search').style.display = 'none';
        if (mychart != undefined) {
            mychart.destroy();
        }
    })
}
function calculate_gpa(courses){
    var classmenu = document.getElementById('classes');
    var profmenu = document.getElementById('professors');
    var year_menu = document.getElementById('year');
    var term_menu = document.getElementById('term');
    var year_term = '';
    var term = '';
    grade = 0;
    enrolled = 0;
    var yArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < courses.length; i++) {
        if (courses[i].CRSE_TITLE == classmenu.value && courses[i].PROF_NAME == profmenu.value && courses[i].YEAR == year_menu.value && courses[i].TERM == term_menu.value) {
            layout = courses[i].CRSE_TITLE;
            enrolled += courses[i].CNTOFGRADE;
            prof_name = courses[i].PROF_NAME;
            year_term = courses[i].YEAR_TERM;
            term = courses[i].TERM;
            if (courses[i].GRADE == 'A') {
                grade += 4.0 * courses[i].CNTOFGRADE;
                yArray[1] += courses[i].CNTOFGRADE;
            }
            else if (courses[i].GRADE == 'A+') {
                grade += 4.0 * courses[i].CNTOFGRADE;
                yArray[0] += courses[i].CNTOFGRADE;
            }
            else if (courses[i].GRADE == 'A-') {
                grade += 3.7 * courses[i].CNTOFGRADE;
                yArray[2] += courses[i].CNTOFGRADE;
            }
            else if (courses[i].GRADE == 'B+') {
                grade += 3.3 * courses[i].CNTOFGRADE;
                yArray[3] += courses[i].CNTOFGRADE;
            }
            else if (courses[i].GRADE == 'B') {
                grade += 3.0 * courses[i].CNTOFGRADE;
                yArray[4] += courses[i].CNTOFGRADE;
            }
            else if (courses[i].GRADE == 'B-') {
                grade += 2.7 * courses[i].CNTOFGRADE;
                yArray[5] += courses[i].CNTOFGRADE;
            }
            else if (courses[i].GRADE == 'C+') {
                grade += 2.3 * courses[i].CNTOFGRADE;
                yArray[6] += courses[i].CNTOFGRADE;
            }
            else if (courses[i].GRADE == 'C') {
                grade += 2.0 * courses[i].CNTOFGRADE;
                yArray[7] += courses[i].CNTOFGRADE;
            }
            else if (courses[i].GRADE == 'C-') {
                grade += 1.7 * courses[i].CNTOFGRADE;
                yArray[8] += courses[i].CNTOFGRADE;
            }
            else if (courses[i].GRADE == 'D+') {
                grade += 1.3 * courses[i].CNTOFGRADE;
                yArray[9] += courses[i].CNTOFGRADE;
            }
            else if (courses[i].GRADE == 'D') {
                grade += 1.0 * courses[i].CNTOFGRADE;
                yArray[10] += courses[i].CNTOFGRADE;
            }
            else if (courses[i].GRADE == 'D-') {
                grade += 0.7 * courses[i].CNTOFGRADE;
                yArray[11] += courses[i].CNTOFGRADE;
            }
        }
    }
    if (mychart != undefined) {
        mychart.destroy();
    }
    if (grade != 0 && enrolled != 0){
        draw(grade, enrolled, xArray, yArray, layout, prof_name, year_term, term);
    }
    else{
        document.querySelector('p').innerHTML = 'No such evaluation available.';
    }
}
function draw(grade, enrolled, xArray, yArray, layout, prof_name, year_term, term) {
    //console.log(grade, enrolled);
    document.querySelector('p').innerHTML = 'year: '+year_term+' term: '+term+'<br><br>Average GPA: '+(grade/enrolled).toFixed(2)+'<br><br>Enrolled: '+enrolled;
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
