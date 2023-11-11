<h1 class="nombre-pagina">Actualizar Servicio</h1>
<p class="descripcion-pagina">Modifica los valores del formulario</p>

<?php 
    // include_once __DIR__ . '/../templates/barra.php'; 
    include_once __DIR__ . '/../templates/alertas.php'; 
?>

<!-- Nota: En los formularios de actualizar, no se coloca action, para que envíe al mismo archivo y considere el ?id -->
<form method="post" class="formulario">
    <?php include_once __DIR__ .'/formulario.php'; ?>
    <input type="submit" class="boton" value="Actualizar">
</form>