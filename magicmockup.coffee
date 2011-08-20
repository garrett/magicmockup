$ = @jQuery

@magicmockup = do ->
  inkNS = 'http://www.inkscape.org/namespaces/inkscape'
  $doc = $(@document)
  views = {}


  # Do the heavy lifting
  # (right now, there's only "next" for switching pages; more to come)
  _dispatch = (context, command, id) ->
    act =
      next: ->
        # Hide the current visible view
        $(context).parents('g:visible').last().hide()
        # Show the specified view
        $(views[id]).show?()

    act[command]?()


  # Return the description for an element
  _getDescription = (el) ->
    $(el).children('desc').text()


  init = ->
    # Propogate views
    $('g').each ->
      label = @getAttributeNS(inkNS, 'label')
      views[label] = @ if label

    $doc
      # Handle clicks on items with instructions
      .delegate 'g', 'click', (e) ->
        actions = _getDescription(e.currentTarget)

        # Skip if there's no description
        return unless actions

        for action in actions.split(/([\s\n]+)/)
          [command, id] = action.split(/\=/)

          _dispatch(@, command, id)

      # Change the cursor for interactive elements
      .delegate 'g', 'hover', (e) ->
        $this = $(this)

        # Skip if already hoverable
        return if $this.data('hoverable')
        # Skip if there's no description
        return unless _getDescription(e.currentTarget)

        $this.css(cursor: 'pointer').data('hoverable', true)


  {init} # Public exports


# Dummy function to handle the inline JS
# (FIXME: The dummy JS should be removed from the SVG)
@nextScreen = (e) ->
  #e.preventDefault()

# init is called when the SVG document is loaded
@init = ->
  magicmockup.init()
