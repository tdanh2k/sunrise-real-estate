-- DROP SCHEMA dbo;

CREATE SCHEMA dbo;
-- [sunrise-real-estate].dbo.Auth0Profile definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.Auth0Profile;

CREATE TABLE [sunrise-real-estate].dbo.Auth0Profile (
	user_id varchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	user_name nvarchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	email nvarchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	email_verified bit NULL,
	phone_number varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	phone_verified bit NULL,
	name nvarchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	picture nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	nickname nvarchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	given_name nvarchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	family_name nvarchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	last_ip varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	last_login datetime NULL,
	logins_count int NULL,
	blocked bit NULL,
	CONSTRAINT Auth0Profile_PK PRIMARY KEY (user_id)
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
	Title nvarchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	Description nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	UserId varchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	TypeId uniqueidentifier NOT NULL,
	Address varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	CONSTRAINT Blog_PK PRIMARY KEY (Id),
	CONSTRAINT Blog_Auth0Profile_FK FOREIGN KEY (UserId) REFERENCES [sunrise-real-estate].dbo.Auth0Profile(user_id),
	CONSTRAINT Blog_GlobalBlogType_FK FOREIGN KEY (TypeId) REFERENCES [sunrise-real-estate].dbo.GlobalBlogType(Id)
);


-- [sunrise-real-estate].dbo.BlogImage definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.BlogImage;

CREATE TABLE [sunrise-real-estate].dbo.BlogImage (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	BlogId uniqueidentifier NULL,
	Name nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	[Size] int NULL,
	[Path] nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	MimeType varchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	Code varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CONSTRAINT BlogImage_PK PRIMARY KEY (Id),
	CONSTRAINT BlogImage_Blog_FK FOREIGN KEY (BlogId) REFERENCES [sunrise-real-estate].dbo.Blog(Id) ON DELETE CASCADE
);


-- [sunrise-real-estate].dbo.BlogStats definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.BlogStats;

CREATE TABLE [sunrise-real-estate].dbo.BlogStats (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	BlogId uniqueidentifier NOT NULL,
	CreatedDate datetime NOT NULL,
	ViewCount int NULL,
	CONSTRAINT BlogStats_PK PRIMARY KEY (Id),
	CONSTRAINT BlogStats_Blog_FK FOREIGN KEY (BlogId) REFERENCES [sunrise-real-estate].dbo.Blog(Id) ON DELETE CASCADE
);


-- [sunrise-real-estate].dbo.DraftBlog definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.DraftBlog;

CREATE TABLE [sunrise-real-estate].dbo.DraftBlog (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	Idx int IDENTITY(0,1) NOT NULL,
	Code varchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Title nvarchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	Description nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	UserId varchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	TypeId uniqueidentifier NOT NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	CONSTRAINT DraftBlog_PK PRIMARY KEY (Id),
	CONSTRAINT DraftBlog_Auth0Profile_FK FOREIGN KEY (UserId) REFERENCES [sunrise-real-estate].dbo.Auth0Profile(user_id),
	CONSTRAINT DraftBlog_GlobalBlogType_FK FOREIGN KEY (TypeId) REFERENCES [sunrise-real-estate].dbo.GlobalBlogType(Id)
);


-- [sunrise-real-estate].dbo.DraftBlogImage definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.DraftBlogImage;

CREATE TABLE [sunrise-real-estate].dbo.DraftBlogImage (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	DraftBlogId uniqueidentifier NULL,
	Name nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	[Size] int NULL,
	[Path] nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	MimeType varchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	Code varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CONSTRAINT DraftBlogImage_PK PRIMARY KEY (Id),
	CONSTRAINT DraftBlogImage_DraftBlog_FK FOREIGN KEY (DraftBlogId) REFERENCES [sunrise-real-estate].dbo.DraftBlog(Id) ON DELETE CASCADE
);


-- [sunrise-real-estate].dbo.DraftPost definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.DraftPost;

CREATE TABLE [sunrise-real-estate].dbo.DraftPost (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	Idx int IDENTITY(0,1) NOT NULL,
	Code varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Title nvarchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	Description nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	UserId varchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	TypeId uniqueidentifier NOT NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	Address nvarchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	MapUrl varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Price float NULL,
	Area float NULL,
	CONSTRAINT DraftPost_PK PRIMARY KEY (Id),
	CONSTRAINT DraftPost_Auth0Profile_FK FOREIGN KEY (UserId) REFERENCES [sunrise-real-estate].dbo.Auth0Profile(user_id),
	CONSTRAINT DraftPost_GlobalPostType_FK FOREIGN KEY (TypeId) REFERENCES [sunrise-real-estate].dbo.GlobalPostType(Id)
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
	CONSTRAINT DraftCurrentDetail_PK PRIMARY KEY (Id),
	CONSTRAINT DraftCurrentDetail_DraftPost_FK FOREIGN KEY (DraftId) REFERENCES [sunrise-real-estate].dbo.DraftPost(Id) ON DELETE CASCADE,
	CONSTRAINT DraftCurrentDetail_GlobalPostDetail_FK FOREIGN KEY (DetailId) REFERENCES [sunrise-real-estate].dbo.GlobalPostDetail(Id)
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


-- [sunrise-real-estate].dbo.DraftPostImage definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.DraftPostImage;

CREATE TABLE [sunrise-real-estate].dbo.DraftPostImage (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	Name nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	[Size] int NULL,
	MimeType varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	[Path] nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	DraftId uniqueidentifier NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	Code varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CONSTRAINT DraftPostImage_PK PRIMARY KEY (Id),
	CONSTRAINT DraftPostImage_DraftPost_FK FOREIGN KEY (DraftId) REFERENCES [sunrise-real-estate].dbo.DraftPost(Id) ON DELETE CASCADE
);


-- [sunrise-real-estate].dbo.PendingBlog definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.PendingBlog;

CREATE TABLE [sunrise-real-estate].dbo.PendingBlog (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	Idx int IDENTITY(0,1) NOT NULL,
	Code varchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Title nvarchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	Description nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	UserId varchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	TypeId uniqueidentifier NOT NULL,
	Address varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	ApprovedByUserId varchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	ApprovedDate datetime NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	CONSTRAINT PendingBlog_PK PRIMARY KEY (Id),
	CONSTRAINT PendingBlog_Auth0Profile_ApprovedByUserId_FK FOREIGN KEY (ApprovedByUserId) REFERENCES [sunrise-real-estate].dbo.Auth0Profile(user_id),
	CONSTRAINT PendingBlog_Auth0Profile_FK FOREIGN KEY (UserId) REFERENCES [sunrise-real-estate].dbo.Auth0Profile(user_id),
	CONSTRAINT PendingBlog_GlobalBlogType_FK FOREIGN KEY (TypeId) REFERENCES [sunrise-real-estate].dbo.GlobalBlogType(Id)
);


-- [sunrise-real-estate].dbo.PendingBlogImage definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.PendingBlogImage;

CREATE TABLE [sunrise-real-estate].dbo.PendingBlogImage (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	PendingBlogId uniqueidentifier NULL,
	Name nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	[Size] int NULL,
	[Path] nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	MimeType varchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	Code varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CONSTRAINT PendingBlogImage_PK PRIMARY KEY (Id),
	CONSTRAINT PendingBlogImage_PendingBlog_FK FOREIGN KEY (PendingBlogId) REFERENCES [sunrise-real-estate].dbo.PendingBlog(Id) ON DELETE CASCADE
);


-- [sunrise-real-estate].dbo.PendingPost definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.PendingPost;

CREATE TABLE [sunrise-real-estate].dbo.PendingPost (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	Idx int IDENTITY(0,1) NOT NULL,
	Code varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Title nvarchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	Description nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	UserId varchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	TypeId uniqueidentifier NOT NULL,
	Address nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	MapUrl varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Price float NULL,
	ApprovedByUserId varchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	ApprovedDate datetime NULL,
	Area float NULL,
	CONSTRAINT PendingPost_PK PRIMARY KEY (Id),
	CONSTRAINT PendingPost_Auth0Profile_ApprovedByUserId_FK FOREIGN KEY (ApprovedByUserId) REFERENCES [sunrise-real-estate].dbo.Auth0Profile(user_id),
	CONSTRAINT PendingPost_Auth0Profile_FK FOREIGN KEY (UserId) REFERENCES [sunrise-real-estate].dbo.Auth0Profile(user_id),
	CONSTRAINT PendingPost_GlobalPostType_FK FOREIGN KEY (TypeId) REFERENCES [sunrise-real-estate].dbo.GlobalPostType(Id)
);


-- [sunrise-real-estate].dbo.PendingPostCurrentDetail definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.PendingPostCurrentDetail;

CREATE TABLE [sunrise-real-estate].dbo.PendingPostCurrentDetail (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	PendingPostId uniqueidentifier NOT NULL,
	DetailId uniqueidentifier NOT NULL,
	Value nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	CONSTRAINT PendingCurrentDetail_PK PRIMARY KEY (Id),
	CONSTRAINT PendingCurrentDetail_GlobalPostDetail_FK FOREIGN KEY (DetailId) REFERENCES [sunrise-real-estate].dbo.GlobalPostDetail(Id),
	CONSTRAINT PendingCurrentDetail_PendingPost_FK FOREIGN KEY (PendingPostId) REFERENCES [sunrise-real-estate].dbo.PendingPost(Id) ON DELETE CASCADE
);


-- [sunrise-real-estate].dbo.PendingPostFeature definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.PendingPostFeature;

CREATE TABLE [sunrise-real-estate].dbo.PendingPostFeature (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	Title nvarchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	Description nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	PendingPostId uniqueidentifier NOT NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	CONSTRAINT PendingPostFeature_PK PRIMARY KEY (Id),
	CONSTRAINT PendingPostFeature_Post_FK FOREIGN KEY (PendingPostId) REFERENCES [sunrise-real-estate].dbo.PendingPost(Id) ON DELETE CASCADE
);


-- [sunrise-real-estate].dbo.PendingPostImage definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.PendingPostImage;

CREATE TABLE [sunrise-real-estate].dbo.PendingPostImage (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	Name nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	[Size] int NULL,
	[Path] nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	PendingPostId uniqueidentifier NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	MimeType varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Code varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CONSTRAINT PendingPostImage_PK PRIMARY KEY (Id),
	CONSTRAINT PendingPostImage_PendingPost_FK FOREIGN KEY (PendingPostId) REFERENCES [sunrise-real-estate].dbo.PendingPost(Id) ON DELETE CASCADE
);


-- [sunrise-real-estate].dbo.Post definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.Post;

CREATE TABLE [sunrise-real-estate].dbo.Post (
	Id uniqueidentifier DEFAULT newid() NOT NULL,
	Idx int IDENTITY(0,1) NOT NULL,
	Code varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Title nvarchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Description nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	UserId varchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	TypeId uniqueidentifier NOT NULL,
	Address nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	MapUrl varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Price float NULL,
	Area float NULL,
	CONSTRAINT Post_PK PRIMARY KEY (Id),
	CONSTRAINT Post_Auth0Profile_FK FOREIGN KEY (UserId) REFERENCES [sunrise-real-estate].dbo.Auth0Profile(user_id),
	CONSTRAINT Post_PostType_FK FOREIGN KEY (TypeId) REFERENCES [sunrise-real-estate].dbo.GlobalPostType(Id)
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
	CONSTRAINT PostCurrentDetail_PostDetail_FK FOREIGN KEY (DetailId) REFERENCES [sunrise-real-estate].dbo.GlobalPostDetail(Id),
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
	Name nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	[Size] int NULL,
	[Path] nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	PostId uniqueidentifier NULL,
	CreatedDate datetime DEFAULT getdate() NULL,
	MimeType varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Code varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
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