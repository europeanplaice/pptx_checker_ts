vim.cmd [[packadd packer.nvim]]

return require('packer').startup(function(use)
    use 'Mofiqul/dracula.nvim'
	use 'tpope/vim-surround'
	use 'tomasr/molokai'
    use {
        "windwp/nvim-autopairs",
        config = function() require("nvim-autopairs").setup {} end
    }
    use 'p00f/nvim-ts-rainbow'
    use 'nvim-lualine/lualine.nvim'
    use 'Pocco81/auto-save.nvim'
    use 'simeji/winresizer'
    use 'lambdalisue/fern.vim'
    use 'mattn/emmet-vim'
    use 'wbthomason/packer.nvim' -- Package manager
    use 'neovim/nvim-lspconfig' -- Configurations for Nvim LSP
    use { "williamboman/mason.nvim" }
    use "williamboman/mason-lspconfig.nvim"
    use "airblade/vim-gitgutter"
    use "hrsh7th/nvim-cmp"
    use "hrsh7th/cmp-nvim-lsp"
    use "hrsh7th/cmp-vsnip"
    use "hrsh7th/cmp-buffer"

    use "hrsh7th/vim-vsnip"
    use "tpope/vim-fugitive"
    use "romgrk/barbar.nvim"
    use "terrortylor/nvim-comment"
    use {"akinsho/toggleterm.nvim", tag = '*'}
    use {
        'nvim-treesitter/nvim-treesitter',
        run = ':TSUpdate'
    }
    use 'nvim-treesitter/nvim-treesitter-context'
    use {
      'nvim-telescope/telescope.nvim', tag = '0.1.0',
    -- or                            , branch = '0.1.x',
      requires = { {'nvim-lua/plenary.nvim'} }
    }
    use {
        "SmiteshP/nvim-navic",
        requires = "neovim/nvim-lspconfig"
    }
    use {
      'phaazon/hop.nvim',
      branch = 'v2', -- optional but strongly recommended
    }
    use 'mfussenegger/nvim-treehopper'
    use "ziontee113/syntax-tree-surfer"
    use {
      "folke/twilight.nvim"
    }
    use {'lukas-reineke/indent-blankline.nvim', tag = 'v2.20.2'}

end)
