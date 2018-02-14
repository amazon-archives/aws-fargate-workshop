$(window).on('load', function() {
  // "Copy to Clipboard" buttons
  $('button.copy').on('click', function(e) {
    const button = $(e.target)
    const textArea = $('textarea#buffer');
    const previousButtonText = button.text();
    const content = button.prev().text();

    textArea.show().val(content).select();
    document.execCommand('copy', false);
    textArea.hide().val('');

    setTimeout(() => button.text(previousButtonText), 3000);
    button.text('Copied!');
  });

  // Set external links to open in new tab
  $('a[href^="http"').each((_, link) => link.target = 'blank');
});
