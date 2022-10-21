require('plugins')
-- require'lspconfig'.setup{}
-- require'lspconfig'.pyright.setup{}
require('lsp')
require('lualineconf')
require('cmpconf')
require('keymap')
require('barbarconfig')
require('toggletermconfig')
require('telescopeconfig')
require('treesitterconfig')
require('tscontextconfig')
require('hopconfig')
require('stsconfig')
require('nvim_comment').setup()

vim.cmd [[

syntax on
let g:dracula_italic = 0
colorscheme dracula
" test
highlight Comment ctermfg=245
highlight CursorIM guifg=1
highlight Cursor guifg=2

set t_Co=256
set number relativenumber
set fenc=utf-8
set showcmd
set cursorline
set autoindent
set smartindent
autocmd FileType html setlocal shiftwidth=2 tabstop=2
autocmd FileType javascript setlocal shiftwidth=2 tabstop=2
set encoding=utf-8
set fileencodings=utf-8,iso-2022-jp,euc-jp,sjis
set fileformats=unix,dos,mac
set laststatus=2
set showmatch
set virtualedit=onemore
highlight Visual ctermbg=black cterm=reverse
set clipboard+=unnamedplus
set nowrap
set tabstop=4
set shiftwidth=4
if has("unix")
    set shell=bash
elseif has("win64")
    set shell=powershell
endif
set expandtab
let _curfile=expand("%:r")
if _curfile == 'Makefile'
  set noexpandtab
endif
if _curfile == 'makefile'
  set noexpandtab
endif
"set autoread | au CursorHold * checktime | call feedkeys("jk")
set noswapfile
	]]

require('twilightconfig')
require('indentconfig')
