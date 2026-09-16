(function(){
  var desktop = window.misionDesktop;
  var bar = document.getElementById('updateBar');
  if(!desktop || !desktop.updater || !bar) return;

  var message = document.getElementById('updateMessage');
  var action = document.getElementById('updateAction');
  var progress = document.getElementById('updateProgress');

  function render(state){
    if(state.status === 'available'){
      bar.hidden = false;
      message.textContent = 'Hay una actualización disponible' + (state.version ? ' · v' + state.version : '');
      action.hidden = false;
      action.textContent = 'Actualizar ahora';
      action.onclick = function(){ desktop.updater.download(); };
    } else if(state.status === 'downloading'){
      bar.hidden = false;
      message.textContent = 'Descargando actualización · ' + (state.percent || 0) + '%';
      action.hidden = true;
      progress.hidden = false;
      progress.value = state.percent || 0;
    } else if(state.status === 'downloaded'){
      bar.hidden = false;
      message.textContent = 'Actualización lista para instalar';
      action.hidden = false;
      action.textContent = 'Reiniciar y actualizar';
      action.onclick = function(){ desktop.updater.install(); };
      progress.hidden = true;
    } else if(state.status === 'error'){
      bar.hidden = false;
      message.textContent = 'No se pudo comprobar la actualización';
      action.hidden = true;
      progress.hidden = true;
    }
  }

  desktop.updater.onState(render);
  desktop.updater.getState().then(render);
})();
