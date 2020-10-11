<?php

if(isset($_POST['submit']))
{
    $content = file_get_contents("data.json");
    $users =  json_decode($content);
    $user = new stdClass();
    $user->id = count($users) + 1;
    $user->name = $_POST['name'];
    $user->email = $_POST['email'];
    $user->password = $_POST['password'];
    // var_dump($user);
    array_push($users,$user);
    
    // var_dump(json_encode($users));
    $file = fopen("data.json", 'w');
    fwrite($file, json_encode($users));
    
    fclose($file);
}else if(isset($_POST['delete']) && $_POST['delete'] == 'submit')
{
    $id = htmlspecialchars($_POST['id']);
    $content = file_get_contents("data.json");
    $users =  json_decode($content);
    for($i=0; $i<count($users);$i++)
    {
        if($users[$i]->id == $id){
            unset($users[$i]);
            $file = fopen("data.json", 'w');
            fwrite($file,json_encode(array_values($users)));
            fclose($file);
            break;
        }
    }
}