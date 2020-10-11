$(function(){
    var icons = {
        header: "ui-icon-circle-arrow-e",
        activeHeader: "ui-icon-circle-arrow-s"
    };

    $("#programingDev").accordion({
        collapsible:true,
        icons: icons,
        heightStyle: "content",
        active: null              
    });

    
    var dialog, form = $("#login-form"), 
    emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    name = $( "#name" ),
    email = $( "#email" ),
    password = $( "#password" ),
    allFields = $( [] ).add( name ).add( email ).add( password ),
    tips = $( ".validateTips" );
    
    function updateTips( t ) {
        tips.text( t )
            .addClass( "ui-state-highlight" );
        setTimeout(function() {
            tips.removeClass( "ui-state-highlight", 1500 );
        }, 500 );
    }
    function checkLength( o, n, min, max ) {
        if ( o.val().length > max || o.val().length < min ) {
            o.addClass( "ui-state-error" );
            updateTips( "Length of " + n + " must be between " +
            min + " and " + max + "." );
            return false;
        } else {
            return true;
        }
    }
    function checkRegexp( o, regexp, n ) {
        if ( !( regexp.test( o.val() ) ) ) {
            o.addClass( "ui-state-error" );
            updateTips( n );
            return false;
        } else {
            return true;
        }
    }
    function addUser() {
        var valid = true;
        allFields.removeClass( "ui-state-error" );
    
        valid = checkLength( name, "username", 3, 16 );
        valid = checkLength( email, "email", 6, 80 );
        valid = checkLength( password, "password", 5, 16 );
    
        valid = valid && checkRegexp( name, /^[a-z]([0-9a-z_\s])+$/i, "Username may consist of a-z, 0-9, underscores, spaces and must begin with a letter." );
        valid = valid && checkRegexp( email, emailRegex, "eg. ui@jquery.com" );
        valid = valid && checkRegexp( password, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9" );
    
        if ( valid ) {           
            postData();
            dialog.dialog( "close" );
        }
        return valid;
    }
    dialog = $( "#dialog-form" ).dialog({
                autoOpen: false,
                width: 350,
                modal: true,
                buttons: {
                    "Create an account": addUser,
                    Cancel: function() {
                        dialog.dialog( "close" );
                    }
                },
                close: function() {
                    form[ 0 ].reset();
                    $(".validateTips").text("All form fields are required.")
                    allFields.removeClass( "ui-state-error" );
                }
            });
    $("#btn").click(function(){
        dialog.dialog("open");
    })

  
    //get data from server 
    function getData()
    {
        //empty the table body
        $("#usersData > tbody").empty();
        $.ajax({
            url:"data.json",
            method:"GET",
            cache:false,
            dataType:"json",
            success: function(data){
                // $("#usersData > tbody").html
                var tr = "";
                if(!data.length){
                    $("#usersData > tbody").html("<tr><td style='text-align:center' colspan='5'>No Data to show</td></tr>")
                }else {

                    data.forEach(el => {
                        tr = `<tr>
                            <td>${el.id}</td>
                            <td>${el.name}</td>
                            <td>${el.email}</td>
                            <td>${el.password}</td>
                            <td> <button class="btn-delete-user" onclick="deleteUser(${el.id}, '${el.name}')" data-id="${el.id}"> <span class="ui-icon ui-icon-trash"></span> </button> </td>
                            </tr>`;
                        $("#usersData > tbody").append(tr);
                    });
                }
                
            }
        })
    }

    getData();
    //Register user
    function postData()
    {
        var name = $("#name").val();
        var email = $("#email").val()
        var password = $("#password").val()
        $.ajax({
            url:'add.php',
            method:"post",
            data:{
                submit:"submit",
                name: name,
                email: email,
                password: password
            },
            success:function(data){
                // console.log(data)
                getData();
            }
        })
    }
    // Delete a user
    function userDelete(id)
    {
        $.ajax({
            url:'add.php',
            method:"post",
            data:{
                delete:"submit",
                id: id                
            },
            success:function(data){
                console.log(data)
                getData();
            }
        })
    }
    $("#dialog-confirm").dialog({
        autoOpen:false,
        modal:true,
        draggable:false,
        buttons:{
            "Delete The User": function(event){
                userDelete($("#dialog-confirm").data("id"));
                $(this).dialog("close")
            },
            Cancel: function(){
                $(this).dialog("close")
            }
        }
    })
    window.deleteUser = function (id, name){$("#dialog-confirm").data("id", id).dialog("open")}
                
    
    
})
// function deleteUser(id)
// {  
//     alert("delete")
//     // $.ajax({
//     //     url:'add.php',
//     //     method:"post",
//     //     data:{
//     //         delete:"submit",
//     //         id: id                
//     //     },
//     //     success:function(data){
//     //         console.log(data)
//     //         $.getData();
//     //     }
//     // })
// }

