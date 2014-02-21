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
		currentUser = {}
	;
	
	
	/*
	===============================================
	========================= APPLICATION FUNCTIONS	
	*/

    var loadApp = function(){
        $.get('templates/app.html', function(html){
            var h = $(html);
            var appCode = h.find('#app_ui_template').html();

            $.template('app', appCode);
            $.render(currentUser, 'app');
            container.html(appCode);

            //loadProjects();
            console.log(currentUser);
            $('#logout_btn').on('click', logout);

            if(currentUser.fname === ''){
                $('#currentuser').html("Welcome " + currentUser.user);
            }else{
                $('#currentuser').html("Welcome " + currentUser.fname);
            }

        });
        return false;
    };
	
	
	var loadLanding = function(){
		$.get('templates/landing.html', function(html){
			var h = $(html);
			var landingCode = h.find('#template_landing').html();
			$.template('landing', landingCode);		// compile template
			$.render(currentUser, 'landing');		// use template
			container.html(landingCode);

            $('#login_btn').on('click', login);
            $('#signup_btn').on('click', loadRegForm);
		});
	};


    var checkLoginState = function(){
        $.ajax({
            url: 'xhr/check_login.php',
            type: 'get',
            dataType: 'json',
            cache:false,
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
                                currentUser = {
                                    fname : r.user.first_name,
                                    lname : r.user.last_name,
                                    id : r.user.id,
                                    user : r.user.user_n
                                };
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
            success: function(response){
                if(response.error){
                    console.log(response.error);
                }else{
                    currentUser = {
                        fname : response.user.first_name,
                        lname : response.user.last_name,
                        id : response.user.id,
                        user : response.user.user_n
                    };
                    loadApp();
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
                    console.log(response.error);
                }else{
                    loadApp();
                }
            }
        });
        return false;
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




