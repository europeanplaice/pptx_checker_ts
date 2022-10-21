require('telescope').setup{}
local builtin = require('telescope.builtin')

vim.api.nvim_create_user_command("TelescopeFindFiles", function ()
    builtin.find_files()
end, {})

vim.api.nvim_create_user_command("TelescopeLiveGrep", function ()
    builtin.live_grep()
end, {})

vim.api.nvim_create_user_command("TelescopeBufferd", function ()
    builtin.buffers()
end, {})

vim.api.nvim_create_user_command("TelescopeHelpTags", function ()
    builtin.help_tags()
end, {})
