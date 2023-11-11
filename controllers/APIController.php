<?php

namespace Controllers;

use Model\Cita;
use Model\CitaServicio;
use Model\Servicio;

class APIController {
    public static function index() {
        $servicios = Servicio::all();

        echo json_encode($servicios);
    }

    public static function guardar() {
        
        // Almacena la cita y devuelve el id
        $cita = new Cita($_POST);
        $resultado = $cita->guardar();

        // Id del registro de cita creado
        $id = $resultado['id'];

        // Almacena los servicios con el id de la cita
        $idServicios = explode(",", $_POST['servicios']);
        foreach($idServicios as $idServicio) {
            $args = [
                'citaId' => $id,
                'servicioId' => $idServicio
            ];

            // Crear la instancia de citaServicio y guardarla
            $citaServicio = new CitaServicio($args);
            $citaServicio->guardar();
        }

        // Retornar una respuesta
        echo json_encode(['resultado' => $resultado]);
    }

    public static function eliminar() {

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'];

            $cita = Cita::find($id);
            $cita->eliminar();

            // Redireccionar a la página de donde venía
            header('Location: ' . $_SERVER['HTTP_REFERER']);
        }
    }
}