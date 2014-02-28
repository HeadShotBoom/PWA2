/*
	Your Project Title
	Author: You
*/

(function($){

	/*
	===============================================
	=========================== APPLICATION GLOBALS
	*/

	var win = $(window),
		body = $(document.body),
		container = $('#container'),	// the only element in index.html
		currentUser = {},
        projects = {},
        tasks = {}
	;


	/*
	===============================================
	========================= APPLICATION FUNCTIONS
	*/

	var loadLanding = function(){
		$.get('templates/landing.html', function(html){
			var h = $(html);
            var template = $.templates(h.find('#template_landing').html());
            var landingCode = template.render(currentUser);
			container.html(landingCode);

            $('#login_btn').on('click', login);
            $('#signup_btn').on('click', loadRegForm);
		});
	};

    var loadApp = function(){
        $.get('templates/app.html', function(html){
            var h = $(html);
            var template = $.templates(h.find('#app_ui_template').html());
            var appCode = template.render(currentUser);
            container.html(appCode);

            loadProjects();

            $('div[name="sortable"]').sortable({handle: ".handle"});

            $('#logout_btn').on('click', logout);

        });
        return false;
    };

    var loadTaskPage = function(projectID){
        $.get('templates/app.html', function(html){
            var h = $(html);
            var template = $.templates(h.find('#template_task_link').html());
            var appCode = template.render(currentUser);
            container.html(appCode);

            loadTasks(projectID);

            $('div[name="sortable"]').sortable({handle: ".handle"});
            $('#back').on('click', loadApp);
            $('#logout_btn').on('click', logout);
        });
        return false;
    };

    var checkLoginState = function(){
        $.ajax({
            url: 'xhr/check_login.php',
            type: 'get',
            dataType: 'json',
            success: function(r){
                if(r.user){
                    $.ajax({
                        url: 'xhr/get_user.php',
                        type: 'get',
                        dataType : 'json',
                        success: function(r){
                            if(r.error){
                                console.log(r.error);
                            }else{
                                currentUser = r.user;
                                loadApp();
                            }
                        }
                    });
                }else{
                    loadLanding();
                }
            }
        });
        return false;
    };
    //  --------  login function ------------- //
    var login = function(){

        var user = $('input#user').val(),
            pwd = $('input#pwd').val();

        $.ajax({
            url: 'xhr/login.php',
            data:{
                username: user,
                password: pwd

            },
            type: 'post',
            dataType: 'json',
            success: function(r){
                if(r.user){
                    $.ajax({
                        url: 'xhr/get_user.php',
                        type: 'get',
                        dataType : 'json',
                        success: function(r){
                            if(r.error){
                                console.log(r.error);
                            }else{
                                currentUser = r.user;
                                loadApp();
                            }
                        }
                    });
                }else{
//                    loadLanding();
                    $('header img').after('<section>'+
                        '<h5 class="title">Username Or Password is Incorrect</h5>'+
                        '</section>');
                }
            }
        });
        return false;
    };

    // ---------Log out function -------

    var logout = function(){

        $.ajax({
            url: 'xhr/logout.php',
            type: 'GET',
            dataType: 'json',
            success: function(response){
                loadLanding();
            }
        });
        return false;
    };

    var loadRegForm = function(){

        var first_name = $('input#first_name').val(),
            last_name = $('input#last_name').val(),
            user = $('input#regname').val(),
            pwd = $('input#regpass').val(),
            email = $('input#regemail').val();
        $.ajax({
            url: 'xhr/register.php',
            data:{
                firstname: first_name,
                lastname: last_name,
                username: user,
                password: pwd,
                email: email

            },
            type: 'post',
            dataType: 'json',
            success: function(response){
                if(response.error){
                    $('div.modalDialog h2').after('<section>'+
                        '<h3 class="title">You must fill out ALL fields!</h3>'+
                        '</section>');
                }else{
                    loadApp();
                }
            }
        });
        return false;
    };

    var loadTasks = function(projectID){
            tasks = {};
            $.get('xhr/get_tasks.php',
                {
                    projectID: projectID
                },
                function(e){
                    if(e.error){
                        console.log(e.error)
                    }else if(e.tasks.length === 0){
                        $('header').after('<section>'+
                            '<a href="#openModal"><input class="medium" type="button" name="New Task +" value="New Task +"></a>'+
                            '<h3 class="title">There aren\'t yet any Tasks associated with this Project</h3>'+
                            '</section>');
                    }else{
                        tasks = e.tasks;
                        $.ajax({
                            url: 'templates/app.html',
                            type: 'get',
                            dataType: 'html',
                            success : function(response){
                                $('#projectNameInTaskModal').html('New Task for ' + tasks[0].projectName);

                                $('header').after('<section>'+
                                    '<a href="#openModal"><input class="medium" type="button" name="New Task +" value="New Task +"></a>'+
                                    '<h1 class="title">Tasks for '+ tasks[0].projectName +'</h1>'+
                                    '</section>');

                                var h = $(response);
                                var taskTemp = $.templates(h.find('#template_task_view').html());
                                for(var i= 0, j = tasks.length; i<j; i++){
                                    var html = taskTemp.render(tasks[i]);
                                    $('#taskWrapper').append(html);
                                    if(tasks[i].status == 'active'){
                                        $('.'+tasks[i].status).html('<img src="img/Active.png" alt="status symbol">');
                                    }else if(tasks[i].status == 'urgent'){
                                        $('.'+tasks[i].status).html('<img src="img/Urgent.png" alt="status symbol">');
                                    }else if(tasks[i].status == 'delayed'){
                                        $('.'+tasks[i].status).html('<img src="img/Delayed.png" alt="status symbol">');
                                    }else if(tasks[i].status == 'complete'){
                                        $('.'+tasks[i].status).html(' <img src="img/Complete.png" alt="status symbol">');
                                    }else{$('.'+tasks[i].status).html('<p>NO STATUS</p>');}

                                    $('#'+tasks[i].id).filter('.trash').on('click', function(theNews){
                                        $.ajax({
                                            url: 'xhr/delete_task.php',
                                            data: {
                                                taskID: theNews.target.id
                                            },
                                            type:'POST',
                                            dataType: 'json',
                                            success: function(response){
                                                loadTaskPage(projectID);
                                            }
                                        });
                                    })

}
                                //Edit Due Date
                                $('.due.inplace').each(function(){
                                    var that = $(this),
                                        input,
                                        taskID = $(this).parent().next().children().last().attr('id'),
                                        projectID = $(this).parent().next().children().last().prev().attr('id'),
                                        savefn = function(){


                                            $.ajax({
                                                type: 'POST',
                                                dataType: 'json',
                                                url: 'xhr/update_task.php',
                                                data : {
                                                    taskID : taskID,
                                                    dueDate: input.val()
                                                },
                                                success: function(response){
                                                   loadTaskPage(projectID);
                                                }
                                            });

                                            return false;
                                        }
                                        ;

                                    that.on('click', function(){
                                        that.hide();

                                        input = $('<input type="text" class="inplaceinput" value="'+ that.text() +'" />')
                                            .insertAfter(that)
                                            .wrap('<form></form>')
                                            .trigger('focus')
                                            .on('keyup', function(e){
                                                if(e.which === 27){
                                                    loadTaskPage(projectID);
                                                }
                                            })
                                            .on('focusout', function(){
                                                loadTaskPage(projectID);
                                            })
                                        ;
                                        input.parent('form').on('submit', savefn);

                                    });


                                });

                                //Edit Task name
                                $('.pname.inplace').each(function(){
                                    var that = $(this),
                                        input,
                                        projectID = $(this).parent().next().next().next().children().last().prev().attr('id'),
                                        taskID = $(this).parent().next().next().next().children().last().attr('id'),
                                        savefn = function(){


                                            $.ajax({
                                                type: 'POST',
                                                dataType: 'json',
                                                url: 'xhr/update_task.php',
                                                data : {
                                                    taskID : taskID,
                                                    taskName: input.val()
                                                },
                                                success: function(response){
                                                    loadTaskPage(projectID);
                                                }
                                            });

                                            return false;
                                        }
                                        ;

                                    that.on('click', function(){
                                        that.hide();

                                        input = $('<input type="text" class="inplaceinput" value="'+ that.text() +'" />')
                                            .insertAfter(that)
                                            .wrap('<form></form>')
                                            .trigger('focus')
                                            .on('keyup', function(e){
                                                if(e.which === 27){
                                                    loadTaskPage(projectID);
                                                }
                                            })
                                            .on('focusout', function(){
                                                loadTaskPage(projectID);
                                            })
                                        ;
                                        input.parent('form').on('submit', savefn);

                                    });


                                });

                                //Edit Task Description
                                $('.description.inplace').each(function(){
                                    var that = $(this),
                                        input,
                                        projectID = $(this).parent().next().next().next().children().last().prev().attr('id'),
                                        taskID = $(this).parent().next().next().next().children().last().attr('id'),
                                        savefn = function(){


                                            $.ajax({
                                                type: 'POST',
                                                dataType: 'json',
                                                url: 'xhr/update_task.php',
                                                data : {
                                                    taskID : taskID,
                                                    taskDescription: input.val()
                                                },
                                                success: function(response){
                                                    loadTaskPage(projectID);
                                                }
                                            });

                                            return false;
                                        }
                                        ;

                                    that.on('click', function(){
                                        that.hide();

                                        input = $('<input type="text" class="inplaceinput" value="'+ that.text() +'" />')
                                            .insertAfter(that)
                                            .wrap('<form></form>')
                                            .trigger('focus')
                                            .on('keyup', function(e){
                                                if(e.which === 27){
                                                    loadTaskPage(projectID);
                                                }
                                            })
                                            .on('focusout', function(){
                                                loadTaskPage(projectID);
                                            })
                                        ;
                                        input.parent('form').on('submit', savefn);

                                    });


                                });





}
});
}
},'json');
        $('#saveTask').on('click', function(){
            var pID = projectID,
                tName = $('input#tname').val(),
                client = $('input#tclientname').val(),
                datedue = $('input#tdue').val(),
                tdescription = $('input#tdescription').val(),
                status = $('#tradiobuttons > input:checked').attr('value');
//        console.log(projectID);
            $.ajax({
                url: 'xhr/new_task.php',
                data:{
                    projectID : pID,
                    taskName: tName,
                    clientID: client,
                    dueDate: datedue,
                    taskDescription: tdescription,
                    status: status

                },
                type: 'post',
                dataType: 'json',
                success: function(r){
                    if(r.error){
                        console.log(r.error)
                    }else{
                        loadTaskPage(projectID);
                    }
                }
            });
        });
};
    var addTaskPage = function(projectID){
    $('#saveTask').on('click', function(){
        var pID = projectID,
            tName = $('input#tname').val(),
            client = $('input#tclientname').val(),
            datedue = $('input#tdue').val(),
            tdescription = $('input#tdescription').val(),
            status = $('#tradiobuttons > input:checked').attr('value');
//        console.log(projectID);
        $.ajax({
            url: 'xhr/new_task.php',
            data:{
                projectID : pID,
                taskName: tName,
                clientID: client,
                dueDate: datedue,
                taskDescription: tdescription,
                status: status

            },
            type: 'post',
            dataType: 'json',
            success: function(r){
                if(r.error){
                    console.log(r.error)
                }else{
                    loadApp();
                }
            }
        });
    });
    };




    var loadProjects = function(){
        projects = {};
        $.get('xhr/get_projects.php', function(e){
            if(e.error){
                console.log(e.error)
            }else{
                projects = e.projects;
                $.ajax({
                    url: 'templates/app.html',
                    type: 'get',
                    dataType: 'html',
                    success : function(response){
                        var h = $(response);
                        var projectTemp = $.templates(h.find('#project-template').html());
                        for(var i= 0, j = projects.length; i<j; i++){
                            var html = projectTemp.render(projects[i]);
                            $('#projectWrapper').append(html);
                            if(projects[i].status == 'active'){
                                $('.'+projects[i].status).html('<img src="img/Active.png" alt="status symbol">');
                            }else if(projects[i].status == 'urgent'){
                                $('.'+projects[i].status).html('<img src="img/Urgent.png" alt="status symbol">');
                            }else if(projects[i].status == 'delayed'){
                                $('.'+projects[i].status).html('<img src="img/Delayed.png" alt="status symbol">');
                            }else if(projects[i].status == 'complete'){
                                $('.'+projects[i].status).html(' <img src="img/Complete.png" alt="status symbol">');
                            }else{$('.'+projects[i].status).html('<p>NO STATUS</p>');}
                            $('#loadTaskPage_'+projects[i].id).on('click', function(t){
                                var projectID = t.target.id.split("_");
                                loadTaskPage(projectID[1]);
                            });

                            $('#addTaskPage_'+projects[i].id).on('click', function(t){
                                var projectID = t.target.id.split("_");
                                addTaskPage(projectID[1]);
                            });



                            $('#'+projects[i].id).filter('.trash').on('click', function(theNews){
                                $.ajax({
                                    url: 'xhr/delete_project.php',
                                    data: {
                                        projectID: theNews.target.id
                                    },
                                    type:'POST',
                                    dataType: 'json',
                                    success: function(response){
                                        loadApp();
                                    }
                                });
                            });


                        }

                        $('#saveProject').on('click', function(){
                            console.log('click');
                            var pName = $('input#pname').val(),
                                client = $('input#pclientname').val(),
                                datedue = $('input#pdue').val(),
                                pdescription = $('input#pdescription').val(),
                                priority = $('input#ppriority').val(),
                                status = $('#pradiobuttons > input:checked').attr('value');

//                                if($('#pradiourgent').is(':checked')) {
//                                    status='urgent';
//                                }else if($('#pradioactive').is(':checked')) {
//                                    status='active';
//                                }else if($('#pradiodelayed').is(':checked')) {
//                                    status='delayed';
//                                }else if($('#pradiocomplete').is(':checked')) {
//                                    status='complete';
//                                }else{status='unlisted'}

                            $.ajax({
                                url: 'xhr/new_project.php',
                                data:{
                                    projectName: pName,
                                    clientID: client,
                                    dueDate: datedue,
                                    projectDescription: pdescription,
                                    status: status,
                                    updatedDate: priority

                                },
                                type: 'post',
                                dataType: 'json',
                                success: function(r){
                                    if(r.error){
                                        console.log(r.error)
                                    }else{
                                        loadApp();
                                    }
                                }
                            });
                        });

                        // Edit Due Date
                        $('.due.inplace').each(function(){
                            var that = $(this),
                                input,
                                projectID = $(this).parent().next().children().last().attr('id'),
                                savefn = function(){


                                    $.ajax({
                                        type: 'POST',
                                        dataType: 'json',
                                        url: 'xhr/update_project.php',
                                        data : {
                                            projectID : projectID,
                                            dueDate: input.val()
                                        },
                                        success: function(response){
                                            loadApp();
                                        }
                                    });

                                    return false;
                                }
                                ;

                            that.on('click', function(){

                                that.hide();

                                input = $('<input type="text" class="inplaceinput" value="'+ that.text() +'" />')
                                    .insertAfter(that)
                                    .wrap('<form></form>')
                                    .trigger('focus')
                                    .on('keyup', function(e){
                                        if(e.which === 27){
                                            loadApp();
                                        }
                                    })
                                    .on('focusout', function(){
                                        loadApp()
                                    })
                                ;
                                input.parent('form').on('submit', savefn);

                            });


                        });

                        // Edit Priority
                        $('.priority.inplace').each(function(){
                            var that = $(this),
                                input,
                                projectID = $(this).parent().next().children().last().attr('id'),
                                savefn = function(){


                                    $.ajax({
                                        type: 'POST',
                                        dataType: 'json',
                                        url: 'xhr/update_project.php',
                                        data : {
                                            projectID : projectID,
                                            updatedDate: input.val()
                                        },
                                        success: function(response){
                                            loadApp();
                                        }
                                    });

                                    return false;
                                }
                                ;

                            that.on('click', function(){

                                that.hide();

                                input = $('<input type="text" class="inplaceinput" value="'+ that.text() +'" />')
                                    .insertAfter(that)
                                    .wrap('<form></form>')
                                    .trigger('focus')
                                    .on('keyup', function(e){
                                        if(e.which === 27){
                                            loadApp();
                                        }
                                    })
                                    .on('focusout', function(){
                                        loadApp()
                                    })
                                ;
                                input.parent('form').on('submit', savefn);

                            });


                        });

                        //Edit Project Name
                        $('.pname.inplace').each(function(){
                            var that = $(this),
                                input,
                                projectID = $(this).parent().next().next().next().children().last().attr('id'),
                                savefn = function(){


                                    $.ajax({
                                        type: 'POST',
                                        dataType: 'json',
                                        url: 'xhr/update_project.php',
                                        data : {
                                            projectID : projectID,
                                            projectName: input.val()
                                        },
                                        success: function(response){
                                            loadApp();
                                        }
                                    });

                                    return false;
                                }
                                ;

                            that.on('click', function(){

                                that.hide();

                                input = $('<input type="text" class="inplaceinput" value="'+ that.text() +'" />')
                                    .insertAfter(that)
                                    .wrap('<form></form>')
                                    .trigger('focus')
                                    .on('keyup', function(e){
                                        if(e.which === 27){
                                            loadApp();
                                        }
                                    })
                                    .on('focusout', function(){
                                        loadApp()
                                    })
                                ;
                                input.parent('form').on('submit', savefn);

                            });


                        });

                        //Edit Project Description
                        $('.description.inplace').each(function(){
                            var that = $(this),
                                input,
                                projectID = $(this).parent().next().next().next().children().last().attr('id'),
                                savefn = function(){


                                    $.ajax({
                                        type: 'POST',
                                        dataType: 'json',
                                        url: 'xhr/update_project.php',
                                        data : {
                                            projectID : projectID,
                                            projectDescription: input.val()
                                        },
                                        success: function(response){
                                            loadApp();
                                        }
                                    });

                                    return false;
                                }
                                ;

                            that.on('click', function(){

                                that.hide();

                                input = $('<input type="text" class="inplaceinput" value="'+ that.text() +'" />')
                                    .insertAfter(that)
                                    .wrap('<form></form>')
                                    .trigger('focus')
                                    .on('keyup', function(e){
                                        if(e.which === 27){
                                            loadApp();
                                        }
                                    })
                                    .on('focusout', function(){
                                        loadApp()
                                    })
                                ;
                                input.parent('form').on('submit', savefn);

                            });


                        });

                        //Edit Client ID
                        $('.clientnum.inplace').each(function(){
                            var that = $(this),
                                input,
                                projectID = $(this).parent().next().next().next().children().last().attr('id'),
                                savefn = function(){


                                    $.ajax({
                                        type: 'POST',
                                        dataType: 'json',
                                        url: 'xhr/update_project.php',
                                        data : {
                                            projectID : projectID,
                                            clientID: input.val()
                                        },
                                        success: function(response){
                                            loadApp();
                                        }
                                    });

                                    return false;
                                }
                                ;

                            that.on('click', function(){

                                that.hide();

                                input = $('<input type="text" class="inplaceinput" value="'+ that.text() +'" />')
                                    .insertAfter(that)
                                    .wrap('<form></form>')
                                    .trigger('focus')
                                    .on('keyup', function(e){
                                        if(e.which === 27){
                                            loadApp();
                                        }
                                    })
                                    .on('focusout', function(){
                                        loadApp()
                                    })
                                ;
                                input.parent('form').on('submit', savefn);

                            });


                        });












                    }
                });
            }
        },'json');

    };


	// 	============================================
	//	SETUP FOR INIT

	var init = function(){

		checkLoginState();
	};


	init();


	/*
	===============================================
	======================================== EVENTS
	*/

	win.on('submit', '#user-reg-form', function(){

		return false;
	});

	/*
	==================================== END EVENTS
	===============================================
	*/




})(jQuery); // end private scope




