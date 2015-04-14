$(function() {
  var uploader = $('input[name="photo"]')
    , body = $('body')

  $('#upload-photo').on('submit', function(e) {
    e.preventDefault()
    var form = $(this)
      , uploader = form.find('input[name=photo]')
      , fileReader = new FileReader()

    fileReader.readAsDataURL(uploader[0].files[0])
    fileReader.onload = function(e) {
      var canvas = $('#photo-container')[0]
        , ctx = canvas.getContext('2d')

      canvas.width  = 400
      canvas.height = 300
      ctx.fillStyle = "#000"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      body.append(canvas)

      var image = new Image()
      image.src = e.target.result
      image.onload = function() {
        var sub = image.height - image.width * 0.7
          , sY = sub > 0 ? sub : 0
          , sWidth = image.width
          , sHeight = image.height - 2*sY
          , scaleRatio = canvas.width / image.width
          , dWidth = sWidth * scaleRatio
          , dHeight = sHeight * scaleRatio
          , dY = (canvas.height - dHeight) / 2

        ctx.drawImage(image
          , 0, sY, sWidth, sHeight
          , 0, dY, dWidth, dHeight)

        Caman("#photo-container", function() {
          this.reloadCanvasData()
          this.render()
        })

        var lyrics = form.find('input[name=lyrics]').val()
          , lineCount = lyrics.split(',').length
          , sangCount = Math.max(1, Math.floor(Math.random() * lyrics.length))
          , sangText = lyrics.substr(0, sangCount)
          , singText = lyrics.substr(sangCount)
          , maxTextLength = canvas.width * 0.8
          , start = (canvas.width - maxTextLength) / 2
          , end = canvas.width - start

        ctx.font = "26px sans"
        ctx.lineWidth = 3
        if(lineCount == 1) {
          var lineY = canvas.height - dY - 20
          var lineX = start
          
          ctx.strokeStyle = 'white'
          ctx.strokeText(sangText, lineX, lineY)
          ctx.fillStyle = '#5179e8'
          ctx.fillText(sangText, lineX, lineY)

          singLineX = lineX + ctx.measureText(sangText).width
          ctx.strokeStyle = '#111'
          ctx.strokeText(singText, singLineX, lineY)
          ctx.fillStyle = '#eee'
          ctx.fillText(singText, singLineX, lineY)
        } else if(lineCount == 2) {
          var firstLineText = lyrics.split(',')[0]
            , secondLineText = lyrics.split(',')[1]
            , firstLineY = canvas.height - dY - 60
            , firstLineX = start
            , secondLineY = firstLineY + 40
            , secondLineX = end - ctx.measureText(secondLineText).width

          if(sangText.length < firstLineText.length) {
            var firstLineRestText = firstLineText.substr(sangText.length)
              , firstRestX = firstLineX + ctx.measureText(sangText).width

            ctx.strokeStyle = 'white'
            ctx.strokeText(sangText, firstLineX, firstLineY)
            ctx.fillStyle = '#5179e8'
            ctx.fillText(sangText, firstLineX, firstLineY)

            ctx.strokeStyle = '#111'
            ctx.strokeText(firstLineRestText, firstRestX, firstLineY)
            ctx.strokeText(secondLineText, secondLineX, secondLineY)
            ctx.fillStyle = '#eee'
            ctx.fillText(firstLineRestText, firstRestX, firstLineY)
            ctx.fillText(secondLineText, secondLineX, secondLineY)
          } else if(sangText.length > firstLineText.length) {
            var secondLineColoredText = secondLineText.substr(0, sangText.length - firstLineText.length)
              , secondLineRestText = secondLineText.substr(sangText.length - firstLineText.length)
              , secondRestX = secondLineX + ctx.measureText(secondLineColoredText).width

            ctx.strokeStyle = 'white'
            ctx.strokeText(firstLineText, firstLineX, firstLineY)
            ctx.strokeText(secondLineColoredText, secondLineX, secondLineY)
            ctx.fillStyle = '#5179e8'
            ctx.fillText(firstLineText, firstLineX, firstLineY)
            ctx.fillText(secondLineColoredText, secondLineX, secondLineY)

            ctx.strokeStyle = '#111'
            ctx.strokeText(secondLineRestText, secondRestX, secondLineY)
            ctx.fillStyle = '#eee'
            ctx.fillText(secondLineRestText, secondRestX, secondLineY)
          } else if(sangText.length == firstLineText.length) {
            ctx.strokeStyle = 'white'
            ctx.strokeText(firstLineText, firstLineX, firstLineY)
            ctx.fillStyle = '#5179e8'
            ctx.fillText(firstLineText, firstLineX, firstLineY)

            ctx.strokeStyle = '#111'
            ctx.strokeText(secondLineText, secondLineX, secondLineY)
            ctx.fillStyle = '#eee'
            ctx.fillText(secondLineText, secondLineX, secondLineY)
          }
        } else {
          alert("Hey there!\nThis is lyrics, not danmaku!")
        }

        // image filter
        var fillBorder = function() {
          ctx.fillStyle = "#000"
          ctx.fillRect(0, 0, canvas.width, dY)
          ctx.fillRect(0, canvas.height - dY, canvas.width, dY)
        }

        $("#resetBtn").on("click", function(e) {
          e.preventDefault()
          ctx.save()
          ctx.setTransform(1, 0, 0, 1, 0, 0)
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          canvas.width  = 400
          canvas.height = 300
          ctx.fillStyle = "#000"
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(image
            , 0, sY, sWidth, sHeight
            , 0, dY, dWidth, dHeight)
          Caman("#photo-container", function() {
            this.reloadCanvasData()
            //this.revert()
            this.render()
          })
        })

        $("#brightnessBtn").on("click", function(e) {
          e.preventDefault()
          Caman("#photo-container", function() {
            this.brightness(10)
            this.contrast(0)
            this.render(fillBorder)
          })
        })

        $("#noiseBtn").on("click", function(e) {
          e.preventDefault()
          Caman("#photo-container", image.src, function() {
            this.noise(10)
            this.render(fillBorder)
          })
        })

        $("#sepiaBtn").on("click", function(e) {
          e.preventDefault()
          Caman("#photo-container", image.src, function() {
            this.sepia(20)
            this.render(fillBorder)
          })
        })

        $("#contrastBtn").on("click", function(e) {
          e.preventDefault()
          Caman("#photo-container", image.src, function() {
            this.contrast(10)
            this.render(fillBorder)
          })
        })

        $("#colorBtn").on("click", function(e) {
          e.preventDefault()
          Caman("#photo-container", image.src, function() {
            this.colorize("#3c69da",10)
            this.render(fillBorder)
          })
        })

      }
    }
  })
})
