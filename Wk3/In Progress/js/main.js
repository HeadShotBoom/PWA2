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
        $.get('../templates/app.html', function(html){
            var h = $(html);
            var appCode = h.find('#app_ui_template').html();

            $.template('app', appCode);
            $.render(currentUser, 'app');
            container.html(appCode);

            //loadProjects();
            $('#logout_btn').on('click', logout);

        });
        return false;
    };
	
	
	var loadLanding = function(){
		$.get('../templates/landing.html', function(html){
			var h = $(html);
			var landingCode = h.find('#template_landing').html();
			$.template('landing', landingCode);		// compile template
			$.render(currentUser, 'landing');		// use template
			container.html(landingCode);



            $('#login_btn').on('click', login);
            //$('#signup_btn').on('click', loadRegForm);
		});
	};


    var checkLoginState = function(){
        $.ajax({
            url: '../xhr/check_login.php',
            type: 'get',
            dataType: 'json',
            success: function(r){
                if(r.user){
                    loadApp();
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
            url: '../xhr/login.php',
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
                    loadApp();
                }
            }
        });
        return false;
    };

    // ---------Log out function -------

    var logout = function(){

        $.ajax({
            url: '../xhr/logout.php',
            type: 'GET',
            dataType: 'json',
            success: function(response){
                loadLanding();
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




