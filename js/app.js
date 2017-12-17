/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());


/* STUDENT APPLICATION */
$(function() {
    var model = {
        getAttendance: function() {
            return JSON.parse(localStorage.attendance);
        },
        setAttendance: function(attendance) {
            localStorage.attendance = JSON.stringify(attendance);
        },
        getAttendanceForStudent: function(name) {
            var attendance = this.getAttendance();
            return attendance[name];
        },
        setAttendanceForStudent: function(name, studentAttendance) {
            var attendance = this.getAttendance();
            attendance[name] = studentAttendance;
            this.setAttendance(attendance);
        },
        getStudents: function() {
            var attendance = this.getAttendance();
            return attendance.keys();
        }
    };

    var octopus = {
        init: function() {
            view.init();
        },
        toggleStudentAttendance: function(name, date) {
            var attendance = model.getAttendanceForStudent(name);
            attendance[date] = !attendance[date];
            model.setAttendanceForStudent(name, attendance);
            view.render();
        },
        getAttendanceForStudent: function(name) {
            return model.getAttendanceForStudent(name);
        },
        getStudents: function() {
            return model.getStudents();
        },
    };

    var view = {
        init: function() {
            this.studentRows = $('tbody .student');
            var studentRows = this.studentRows;
            studentRows.each(function() {
                var name = $(this).children('.name-col').text()
                $(this).children('td').children('input').each(function(i) {
                    $(this).on('click', (function(student, date){
                        return function() {
                            octopus.toggleStudentAttendance(student, date);
                        }
                    })(name, i));
                });
            });
            view.render();
        },
        render: function() {
            var studentRows = this.studentRows;
            studentRows.each(function() {
                var name = $(this).children('.name-col').text()
                var attendance = octopus.getAttendanceForStudent(name); 
                var numMissed = 0;
                $(this).children('td').children('input').each(function(i) {
                    $(this).prop('checked', attendance[i]);
                    numMissed = attendance[i] ? numMissed : (numMissed + 1); 
                });
                $(this).children('.missed-col').text(numMissed);
            });
        }
    };
    octopus.init();
}());
