# Set the source directory
srcdir = js/

# Create the list of modules
modules =   ${srcdir}jquery.inherit-1.1.1.js\
            ${srcdir}vi2.main.js\
            ${srcdir}vi2.parser.js\
            ${srcdir}vi2.utils.js\
            ${srcdir}vi2.videoplayer.js\
            ${srcdir}vi2.clock.js\
            ${srcdir}vi2.xlink.js\
            ${srcdir}vi2.seq.js\
            ${srcdir}vi2.seqv.js\
            ${srcdir}vi2.tags.js\
            ${srcdir}vi2.log.js\
            ${srcdir}vi2.toc.js\
            ${srcdir}vi2.comments.js\
            ${srcdir}vi2.assessment.js\
            ${srcdir}vi2.metadata.js\
						${srcdir}jquery.json-2.4.min.js\
            ${srcdir}jquery.tinysort.js\
            ${srcdir}jquery.tooltip.js\
            ${srcdir}jquery.piemenu.js\
 						${srcdir}jquery.tag-it.js\
            ${srcdir}jquery.spin.js\
            ${srcdir}jquery-ui-1.8.6.custom.min.js\
            ${srcdir}jquery-jtemplates.js\
           
# Bundle all of the modules into vi-two.js
bundle: ${modules}
		cat $^ > js/vi-two.js

#	Compress al of the modules into vi-two.min.js
compress: ${modules}
		cat $^ > vi-two.js
	  java -jar /usr/bin/compiler.jar --js vi-two.js --js_output_file vi-two.min.js


#
bam: $(modules)
		ls

