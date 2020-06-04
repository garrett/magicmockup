$ = @jQuery

@magicmockup = do ->
  $doc = $(@document)
  layers = {}
  filter = {}
  defaultLayer = ''


  # Convenience function to grab attributes from the Inkscape namespace
  _getInk = (el, attr) ->
    inkNS = 'http://www.inkscape.org/namespaces/inkscape'
    el.getAttributeNS(inkNS, attr)


  # Add each layer to the layer object (if it contains a an Inkscape label)
  _initLayers = ($layers = $('g')) ->
    $layers.each ->
      group = _getInk(@, 'groupmode')
      label = _getInk(@, 'label')

      if group is 'layer'
        layers[label] = @
        defaultLayer = label if $(@).is(':visible')

    return


  # Find all filters and store in the filter object
  _findFilters = ->
    $doc.find('filter').each ->
      label = _getInk(@, 'label')
      filter[label] = @id


  # Do the heavy lifting
  # (right now, there's only "next" for switching pages; more to come)
  _dispatch = (context, [command, val]) ->
    act =
      load: (url) ->
        url = url.shift()
        window.location = url || val

      next: (location) ->
        location = location.shift()
        if location.match /#/
          # if "#" is added, then load the new page
          act.load(location)

        else
          # Hide the current visible layer
          $(context).parents('g').not('[style=display:none]').last().hide()

          # Show the specified layer
          $(layers[location]).show?()

          location = '' if location is defaultLayer

          window.location.hash = location

      show: (show_layers) ->
        for layer in show_layers
          $(layers[layer]).show()

      hide: (hide_layers) ->
        for layer in hide_layers
          $(layers[layer]).hide()

      toggle: (toggle_layers) ->
        for layer in toggle_layers
          $(layers[layer]).toggle()

      fadeOut: (params) ->
        if params? and params.length > 0
          # Capture parameters with defaults
          layer = params[0]
          time = params[1] ? 1
          easing = params[2] ? 'linear'
          # Convert time from seconds to milliseconds
          time = parseInt(time) * 1000
          $(layers[layer])
            .attr('opacity', 1)
            .animate svgOpacity: 0.0, time, easing, () ->
            # Reset opacity but hide
            $(this).hide().attr 'opacity', 1

    params = val?.split ','
    act[command]?(params)


  # Return the description for an element
  _getDescription = (el) ->
    $(el).children('desc').text()


  # If there's inline JS, strip it (and provide warnings)
  _stripInlineJS = ->
    $onclick = $('[onclick]')

    return unless $onclick.length

    # Warn about inline JS (if console.warn is available)
    if console and console.warn

      console.group? 'Warning: inline JavaScript found (and deactivated)'
      $onclick.each -> console.warn @id, ':', @onclick
      console.groupEnd?()

    # Strip the inline JS
    $onclick.each -> @onclick = undefined

    return


  # Return the URL fragment
  _getHash = ->
    window.location.hash.substr(1)


  # Hide all layers
  _hideLayers = ->
    for name, layer of layers
      $(layer).hide()


  # Make a layer visible
  _showLayer = (layer) ->
    if typeof layer isnt 'string'
      layer = _getHash()

    # Make sure the layer exists
    return unless layers[layer] or layer is ''

    _hideLayers()
    _dispatch @, ['next', layer or defaultLayer]


  # If a hash is specified, view the appropriate layer
  _setInitialPage = ->
    layer = _getHash()

    if layer
      _showLayer layer


  # Handle clicks on items with instructions
  _handleClick = (e) ->
    actions = _getDescription(e.currentTarget)

    # Skip if there's no description
    return unless actions

    for action in actions.split /([\s\n]+)/
      _dispatch @, action.split /\=/

    return


  # Change the cursor for interactive elements
  _handleHover = (e) ->
    $this = $(this)
    isHovered = e.type is "mouseenter"

    # Skip if there's no description
    return unless _getDescription(e.currentTarget)

    # Alter hover CSS if there's a hover filter
    if filter.hover
      hover = if isHovered then "url(##{filter.hover})" else "none"
      $this.css filter: hover

    # Skip if already hoverable
    return if $this.data('hoverable')

    # We're handling the hoverable state now
    $this.data('hoverable', true).css(cursor: 'pointer')

    return


  # Run on page load
  init = (loadEvent) ->
    _initLayers()
    _setInitialPage()
    _findFilters()
    _stripInlineJS()

    $(window).bind 'hashchange', _showLayer

    $doc.delegate 'g',
      click : _handleClick
      hover : _handleHover


  {init} # Public exports


# Hack to attach the init to <svg/> for an unobtrusive SVG onload
$('svg').attr onload: 'magicmockup.init()'
