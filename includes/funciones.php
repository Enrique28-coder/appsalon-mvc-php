<?php

function debuguear($variable) : string {
    echo "<pre>";
    var_dump($variable);
    echo "</pre>";
    exit;
}

// Escapa / Sanitizar el HTML
function s($html) : string {
    $s = htmlspecialchars($html);
    return $s;
}

function esUltimo(string $actual, string $proximo) : bool {
    if ($actual != $proximo) {
        return true;
    }
    return false;
}

// Función que revisa si existe una sesión, sino la crea
function isSession() : void {
    if ( !isset($_SESSION) ) {
        session_start();
    }
}

// Función que revisa que el usuario esté autenticado
function isAuth() : void {
    if ( !isset($_SESSION['login']) ) {
        header('Location: /');
    }
}

// Función que revisa que el usuario sea admin
function isAdmin() : void {
    if ( !isset($_SESSION['admin']) ) {
        header('Location: /');
    }
}