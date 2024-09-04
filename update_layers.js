function update_basemaps(date){

    if(!('dft' in active_layers))
      active_layers['dft'] = true;

    try{
      var new_date  = get_date(date);
      const [startDateStr, endDateStr] = new_date.split('_');
      planet_url = 'https://tiles3.planet.com/basemaps/v1/planet-tiles/ps_biweekly_visual_subscription_'+new_date+'_mosaic/gmap/{z}/{x}/{y}.png?api_key=PLAK167d2e657cfb45bc816f8a79c651aee8';
      biweekly_label = formatDateRange(startDateStr,endDateStr);
      imagery.setUrl(planet_url);
      imagery.name = 'Imagery';
      if(!('Imagery' in active_layers))
        active_layers['Imagery'] = false;
      }
      catch (error) {
        imagery.name = 'Imagery';      
        active_layers['Imagery'] = false;
    }
  
    // console.log('date',date);
    daily_label = formatDateRange(date);
    date = date.replace(/-/g, '');
    ps_daily_url = 'https://storage.googleapis.com/shrey-snowviz-platform/data/planet_daily/'+date+'/{z}/{x}/{y}.png';
    // ps_daily_url = 'svr_tile_test/{z}/{x}/{y}.png';
    console.log(ps_daily_url);
    ps_daily.setUrl(ps_daily_url);
    ps_daily.name = 'PlanetScope';
    if(!('PlanetScope' in active_layers))
      active_layers['PlanetScope'] = false;

  }
  