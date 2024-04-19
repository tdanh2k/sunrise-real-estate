-- DROP SCHEMA dbo;

CREATE SCHEMA dbo;
-- [sunrise-real-estate].dbo.BlogStats definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.BlogStats;

CREATE TABLE [sunrise-real-estate].dbo.BlogStats (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	BlogId uniqueidentifier NOT NULL,
	CreatedDate datetime NOT NULL,
	ViewCount int NULL,
	CONSTRAINT BlogStats_PK PRIMARY KEY (Id)
);


-- [sunrise-real-estate].dbo.GlobalBlogType definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.GlobalBlogType;

CREATE TABLE [sunrise-real-estate].dbo.GlobalBlogType (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	Idx int NOT NULL,
	Name nvarchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	CONSTRAINT GlobalBlogType_PK PRIMARY KEY (Id)
);


-- [sunrise-real-estate].dbo.GlobalPostDetail definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.GlobalPostDetail;

CREATE TABLE [sunrise-real-estate].dbo.GlobalPostDetail (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	Code varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	Name nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	Unit nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	IsNumber bit DEFAULT 0 NULL,
	CONSTRAINT GlobalPostDetail_PK PRIMARY KEY (Id)
);


-- [sunrise-real-estate].dbo.GlobalPostType definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.GlobalPostType;

CREATE TABLE [sunrise-real-estate].dbo.GlobalPostType (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	Name nvarchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	Idx int NOT NULL,
	CONSTRAINT GlobalPostType_PK PRIMARY KEY (Id)
);


-- [sunrise-real-estate].dbo.Blog definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.Blog;

CREATE TABLE [sunrise-real-estate].dbo.Blog (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	Idx int IDENTITY(0,1) NOT NULL,
	Code varchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Title nvarchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Description nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	UserId varchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	TypeId uniqueidentifier NOT NULL,
	Address varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	CONSTRAINT Blog_PK PRIMARY KEY (Id),
	CONSTRAINT Blog_GlobalBlogType_FK FOREIGN KEY (TypeId) REFERENCES [sunrise-real-estate].dbo.GlobalBlogType(Id)
);


-- [sunrise-real-estate].dbo.BlogImage definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.BlogImage;

CREATE TABLE [sunrise-real-estate].dbo.BlogImage (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	BlogId uniqueidentifier NOT NULL,
	Name nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	[Size] int NULL,
	[Path] nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	MimeType varchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	CONSTRAINT BlogImage_PK PRIMARY KEY (Id),
	CONSTRAINT BlogImage_Blog_FK FOREIGN KEY (BlogId) REFERENCES [sunrise-real-estate].dbo.Blog(Id)
);


-- [sunrise-real-estate].dbo.DraftBlog definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.DraftBlog;

CREATE TABLE [sunrise-real-estate].dbo.DraftBlog (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	Idx int IDENTITY(0,1) NOT NULL,
	Code varchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	Title nvarchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	Description nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	UserId nvarchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	TypeId uniqueidentifier NOT NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	CONSTRAINT DraftBlog_PK PRIMARY KEY (Id),
	CONSTRAINT DraftBlog_GlobalBlogType_FK FOREIGN KEY (TypeId) REFERENCES [sunrise-real-estate].dbo.GlobalBlogType(Id)
);


-- [sunrise-real-estate].dbo.DraftBlogImage definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.DraftBlogImage;

CREATE TABLE [sunrise-real-estate].dbo.DraftBlogImage (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	DraftBlogId uniqueidentifier NOT NULL,
	Name nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	[Size] int NULL,
	[Path] nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	MimeType varchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	CONSTRAINT DraftBlogImage_PK PRIMARY KEY (Id),
	CONSTRAINT DraftBlogImage_DraftBlog_FK FOREIGN KEY (DraftBlogId) REFERENCES [sunrise-real-estate].dbo.DraftBlog(Id)
);


-- [sunrise-real-estate].dbo.DraftPost definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.DraftPost;

CREATE TABLE [sunrise-real-estate].dbo.DraftPost (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	Idx int IDENTITY(0,1) NOT NULL,
	Code varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Title nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	Description nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	UserId varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	TypeId uniqueidentifier NOT NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	Address nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	MapUrl varchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CONSTRAINT DraftPost_PK PRIMARY KEY (Id),
	CONSTRAINT DraftPost_GlobalPostType_FK FOREIGN KEY (TypeId) REFERENCES [sunrise-real-estate].dbo.GlobalPostType(Id)
);


-- [sunrise-real-estate].dbo.DraftPostImage definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.DraftPostImage;

CREATE TABLE [sunrise-real-estate].dbo.DraftPostImage (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	Name nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	[Size] int NULL,
	MimeType varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	[Path] nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	DraftId uniqueidentifier NOT NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	CONSTRAINT DraftPostImage_PK PRIMARY KEY (Id),
	CONSTRAINT DraftPostImage_DraftPost_FK FOREIGN KEY (DraftId) REFERENCES [sunrise-real-estate].dbo.DraftPost(Id)
);


-- [sunrise-real-estate].dbo.Post definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.Post;

CREATE TABLE [sunrise-real-estate].dbo.Post (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	Idx int IDENTITY(0,1) NOT NULL,
	Code varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Title nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Description nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	UserId varchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	TypeId uniqueidentifier NOT NULL,
	Address nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	MapUrl varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CONSTRAINT Post_PK PRIMARY KEY (Id),
	CONSTRAINT Post_GlobalPostType_FK FOREIGN KEY (TypeId) REFERENCES [sunrise-real-estate].dbo.GlobalPostType(Id)
);


-- [sunrise-real-estate].dbo.PostCurrentDetail definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.PostCurrentDetail;

CREATE TABLE [sunrise-real-estate].dbo.PostCurrentDetail (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	PostId uniqueidentifier NOT NULL,
	DetailId uniqueidentifier NOT NULL,
	Value nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	CONSTRAINT PostCurrentDetail_PK PRIMARY KEY (Id),
	CONSTRAINT PostCurrentDetail_GlobalPostDetail_FK FOREIGN KEY (DetailId) REFERENCES [sunrise-real-estate].dbo.GlobalPostDetail(Id),
	CONSTRAINT PostCurrentDetail_Post_FK FOREIGN KEY (PostId) REFERENCES [sunrise-real-estate].dbo.Post(Id) ON DELETE CASCADE
);


-- [sunrise-real-estate].dbo.PostFeature definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.PostFeature;

CREATE TABLE [sunrise-real-estate].dbo.PostFeature (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	Title nvarchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	Description nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	PostId uniqueidentifier NOT NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	CONSTRAINT PostFeature_PK PRIMARY KEY (Id),
	CONSTRAINT PostFeature_Post_FK FOREIGN KEY (PostId) REFERENCES [sunrise-real-estate].dbo.Post(Id) ON DELETE CASCADE
);


-- [sunrise-real-estate].dbo.PostImage definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.PostImage;

CREATE TABLE [sunrise-real-estate].dbo.PostImage (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	Name nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	[Size] int NULL,
	[Path] nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	PostId uniqueidentifier NOT NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	MimeType varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CONSTRAINT PostImage_PK PRIMARY KEY (Id),
	CONSTRAINT PostImage_Post_FK FOREIGN KEY (PostId) REFERENCES [sunrise-real-estate].dbo.Post(Id) ON DELETE CASCADE
);


-- [sunrise-real-estate].dbo.PostStats definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.PostStats;

CREATE TABLE [sunrise-real-estate].dbo.PostStats (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	PostId uniqueidentifier NOT NULL,
	CreatedDate datetime NOT NULL,
	ViewCount int NULL,
	CONSTRAINT PostStats_PK PRIMARY KEY (Id),
	CONSTRAINT PostStats_Post_FK FOREIGN KEY (PostId) REFERENCES [sunrise-real-estate].dbo.Post(Id) ON DELETE CASCADE
);


-- [sunrise-real-estate].dbo.DraftPostCurrentDetail definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.DraftPostCurrentDetail;

CREATE TABLE [sunrise-real-estate].dbo.DraftPostCurrentDetail (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	DraftId uniqueidentifier NOT NULL,
	DetailId uniqueidentifier NOT NULL,
	Value nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	CONSTRAINT DraftPostCurrentDetail_PK PRIMARY KEY (Id),
	CONSTRAINT DraftPostCurrentDetail_DraftPost_FK FOREIGN KEY (DraftId) REFERENCES [sunrise-real-estate].dbo.DraftPost(Id) ON DELETE CASCADE,
	CONSTRAINT DraftPostCurrentDetail_GlobalPostDetail_FK FOREIGN KEY (DetailId) REFERENCES [sunrise-real-estate].dbo.GlobalPostDetail(Id)
);


-- [sunrise-real-estate].dbo.DraftPostFeature definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.DraftPostFeature;

CREATE TABLE [sunrise-real-estate].dbo.DraftPostFeature (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	Title nvarchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	Description nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	DraftId uniqueidentifier NOT NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	CONSTRAINT DraftPostFeature_PK PRIMARY KEY (Id),
	CONSTRAINT DraftPostFeature_DraftPost_FK FOREIGN KEY (DraftId) REFERENCES [sunrise-real-estate].dbo.DraftPost(Id) ON DELETE CASCADE
);