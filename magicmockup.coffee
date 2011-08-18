$ = @jQuery

@magicmockup = do ->
  inkNS = 'http://www.inkscape.org/namespaces/inkscape'
  $doc = $(@document)
  views = {}


  _dispatch = (context, command, id) ->
    act =
      next: ->
        # Hide the current visible view
        $(context).parents('g:visible').last().hide()
        # Show the specified view
        $(views[id]).show?()

    act[command]?()


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

        return unless actions

        for action in actions.split(/([\s\n]+)/)
          [command, id] = action.split(/\=/)

          _dispatch(@, command, id)

      # Change the cursor for interactive elements
      .delegate 'g', 'hover', (e) ->
        $this = $(this)

        return if $this.data('hoverable')

        actions = _getDescription(e.currentTarget)

        return unless actions

        $this.css(cursor: 'pointer').data('hoverable', true)


  {init} # Public exports


# Dummy function to handle the inline JS
@nextScreen = (e) ->
  #e.preventDefault()

@init = ->
  magicmockup.init()
