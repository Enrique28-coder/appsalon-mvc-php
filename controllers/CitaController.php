<?php

namespace Controllers;

use MVC\Router;

class CitaController {
    public static function index(Router $router) {

        // Verificar si existe una sesión, sino la crea
        isSession();

        // Verificar si tiene una sesión iniciada
        isAuth();

        $router->render('cita/index', [
            'nombre' => $_SESSION['nombre'],
            'id' => $_SESSION['id']
        ]);
    }
}