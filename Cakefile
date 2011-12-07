fs = require 'fs'
exec = require('child_process').exec

task 'build', 'Build magicmockup with deps', () ->
  console.log 'Compiling magicmockup.coffee'
  exec 'coffee -cp magicmockup.coffee', (error, stdout, stderr) ->
    if error?
      console.log 'There was an error in exec', error
    else
      console.log 'reading and concatenating dependencies'
      deps = fs.readdirSync 'deps/'
      deps.sort()
      tmp = ''
      for dep in deps
        tmp += fs.readFileSync('deps/' + dep, 'utf-8')

      console.log 'concatenating compiled magicmockup'
      tmp += stdout
      
      console.log 'writing magicmockup.js'
      fs.writeFileSync 'magicmockup.js', tmp

