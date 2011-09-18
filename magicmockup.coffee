$ = @jQuery

@magicmockup = do ->
  inkNS = 'http://www.inkscape.org/namespaces/inkscape'
  $doc = $(@document)
  views = {}
  filter = {}


  _findFilters = ->
    $doc.find('filter').each ->
      label = @getAttributeNS(inkNS, 'label')
      filter[label] = @id

  # Do the heavy lifting
  # (right now, there's only "next" for switching pages; more to come)
  _dispatch = (context, [command, id]) ->
    act =
      next: ->
        # Hide the current visible view
        $(context).parents('g').not('[style=display:none]').last().hide()

        # Show the specified view
        $(views[id]).show?()

    act[command]?()


  # Add each view to the view object (if it contains a an Inkscape label)
  _addViews = ($views) ->
    $views.each ->
      label = @getAttributeNS(inkNS, 'label')
      views[label] = @ if label

    return


  # Handle clicks on items with instructions
  _handleClick = (e) ->
    actions = _getDescription(e.currentTarget)

    # Skip if there's no description
    return unless actions

    for action in actions.split /([\s\n]+)/
      _dispatch(@, action.split /\=/)

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


  # Return the description for an element
  _getDescription = (el) ->
    $(el).children('desc').text()


  # If there's inline JS, strip it (and provide warnings)
  _stripInlineJS = () ->
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


  init = (loadEvent) ->
    _findFilters()
    _addViews $('g')
    _stripInlineJS()

    $doc.delegate 'g'
      click : _handleClick
      hover : _handleHover


  {init} # Public exports


# Hack to attach the init to <svg/> for an unobtrusive SVG onload
$('svg').attr onload: 'magicmockup.init()'
