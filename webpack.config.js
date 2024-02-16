const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { DefinePlugin } = require('webpack')

//Запускаем файл .env
require('dotenv').config()

const mode = process.env.NODE_ENV
const isDev = mode === 'development'

const plugins = [
	//плагин который нам поможет глобально вынести переменные, чтобы мы их могли использовать внутри наших файлов
	new DefinePlugin({
		'process.env': JSON.stringify(process.env),
	}),
	//плагин для сжатия
	new CleanWebpackPlugin(),
	//для работы с html очищаем WhiteSpace и удаляем комментарии в режиме продакшена
	new HtmlWebpackPlugin({
		template: 'index.html',
		minify: {
			collapseWhitespace: !isDev,
			removeComments: !isDev,
		},
	}),
	//и для продакшена и для разработки
	new MiniCssExtractPlugin({
		filename: isDev ? '[name].css' : '[name].[contenthash].css',
		chunkFilename: isDev ? '[id].css' : '[id].[contenthash].css',
	}),
]
// exports ={}
module.exports = {
	context: path.resolve(__dirname, 'src'),
	mode,
	entry: './index.js',
	output: {
		filename: isDev ? '[name].js' : '[name].[contenthash].js',
		path: path.resolve(__dirname, 'dist'),
		assetModuleFilename: 'public/[name].[contenthash][ext][query]',
	},
	//Настройка алиасов чтобы были красивые пути
	resolve: {
		extensions: ['.js'],
		alias: {
			'@': path.resolve(__dirname, 'src/'),
		},
	},
	//для лучшего дебагинга в браузере
	devtool: isDev ? 'source-map' : false,
	//чтобы было комфортно разрабатывать
	devServer: {
		port: 7777,
		//чтобы была быстрая перезагрузка хот
		hot: true,
		//статичная папка
		static: {
			directory: path.join(__dirname, 'public'),
		},
		//настройка роутинга
		historyApiFallback: true,
	},
	optimization: {
		minimize: !isDev,
		minimizer: [
			new CssMinimizerPlugin(),
			new TerserPlugin({
				parallel: true,
				terserOptions: {
					format: {
						comments: false,
					},
				},
			}),
		],
	},
	plugins,
	module: {
		rules: [
			{
				test: /\.html$/i,
				loader: 'html-loader',
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
			{
				test: /\.module\.s[ac]ss$/i,
				use: [
					isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							modules: {
								localIdentName: '[local]_[hash:base64:7]',
							},
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
						},
					},
				],
			},
			{
				test: /^((?!\.module).)*s[ac]ss$/i,
				use: [
					isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
						},
					},
				],
			},
			{
				test: /\.css$/i,
				use: [
					'style-loader',
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true,
						},
					},
				],
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource',
			},
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
		],
	},
}
