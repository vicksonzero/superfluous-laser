# run me once to preview, and then pipe me into bash to run:
# ```
# ./strip_name.sh| bash
# ```


find -type f -wholename './superfluous-laser_*' | sed -r -e 's/.\/superfluous-laser_(.+)\.png/mv & .\/\1.png/'
