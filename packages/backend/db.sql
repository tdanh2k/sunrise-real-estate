-- [sunrise-real-estate].dbo.PostType definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.PostType;

CREATE TABLE [sunrise-real-estate].dbo.PostType (
	Id uniqueidentifier DEFAULT NEWID() NOT NULL,
	Idx int IDENTITY(0,1) NOT NULL,
	Name nvarchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CreatedDate datetimeoffset(0) NULL,
	CONSTRAINT PostType_PK PRIMARY KEY (Id)
);


-- [sunrise-real-estate].dbo.PostDetail definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.PostDetail;

CREATE TABLE [sunrise-real-estate].dbo.PostDetail (
	Id uniqueidentifier DEFAULT NEWID() NOT NULL,
	Code varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	Name nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	Unit nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CreatedDate datetimeoffset(0) DEFAULT sysdatetimeoffset() NULL,
	IsNumber bit DEFAULT 0 NULL,
	CONSTRAINT PostDetail_PK PRIMARY KEY (Id)
);


-- [sunrise-real-estate].dbo.DraftPost definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.DraftPost;

CREATE TABLE [sunrise-real-estate].dbo.DraftPost (
	Id uniqueidentifier DEFAULT NEWID() NOT NULL,
	Idx int IDENTITY(0,1) NOT NULL,
	Code varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Title nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	Description nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	UserId varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	TypeId uniqueidentifier NOT NULL,
	CreatedDate datetimeoffset(0) DEFAULT sysdatetimeoffset() NULL,
	Address nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	MapUrl varchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CONSTRAINT DraftPost_PK PRIMARY KEY (Id),
	CONSTRAINT DraftPost_PostType_FK FOREIGN KEY (Id) REFERENCES [sunrise-real-estate].dbo.PostType(Id)
);


-- [sunrise-real-estate].dbo.DraftPostImage definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.DraftPostImage;

CREATE TABLE [sunrise-real-estate].dbo.DraftPostImage (
	Id uniqueidentifier DEFAULT NEWID() NOT NULL,
	Name nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	[Size] int NULL,
	MimeType varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	[Path] nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	DraftId uniqueidentifier NOT NULL,
	CreatedDate datetimeoffset(0) DEFAULT sysdatetimeoffset() NULL,
	CONSTRAINT DraftPostImage_PK PRIMARY KEY (Id),
	CONSTRAINT DraftPostImage_DraftPost_FK FOREIGN KEY (DraftId) REFERENCES [sunrise-real-estate].dbo.DraftPost(Id)
);


-- [sunrise-real-estate].dbo.Post definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.Post;

CREATE TABLE [sunrise-real-estate].dbo.Post (
	Id uniqueidentifier DEFAULT NEWID() NOT NULL,
	Idx int IDENTITY(0,1) NOT NULL,
	Code varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Title nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	Description nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	UserId varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CreatedDate datetimeoffset(0) DEFAULT sysdatetimeoffset() NULL,
	TypeId uniqueidentifier NOT NULL,
	Address nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	MapUrl varchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CONSTRAINT Post_PK PRIMARY KEY (Id),
	CONSTRAINT Post_PostType_FK FOREIGN KEY (TypeId) REFERENCES [sunrise-real-estate].dbo.PostType(Id)
);


-- [sunrise-real-estate].dbo.PostImage definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.PostImage;

CREATE TABLE [sunrise-real-estate].dbo.PostImage (
	Id uniqueidentifier DEFAULT NEWID() NOT NULL,
	Name nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	[Size] int NULL,
	[Path] nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	PostId uniqueidentifier NOT NULL,
	CreatedDate datetimeoffset(0) DEFAULT sysdatetimeoffset() NULL,
	MimeType varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CONSTRAINT PostImage_PK PRIMARY KEY (Id),
	CONSTRAINT PostImage_Post_FK FOREIGN KEY (PostId) REFERENCES [sunrise-real-estate].dbo.Post(Id) ON DELETE CASCADE
);


-- [sunrise-real-estate].dbo.PostCurrentDetail definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.PostCurrentDetail;

CREATE TABLE [sunrise-real-estate].dbo.PostCurrentDetail (
	Id uniqueidentifier DEFAULT NEWID() NOT NULL,
	PostId uniqueidentifier NOT NULL,
	DetailId uniqueidentifier NOT NULL,
	Value nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CreatedDate datetimeoffset(0) DEFAULT sysdatetimeoffset() NULL,
	CONSTRAINT PostCurrentDetail_PK PRIMARY KEY (Id),
	CONSTRAINT PostCurrentDetail_PostDetail_FK FOREIGN KEY (DetailId) REFERENCES [sunrise-real-estate].dbo.PostDetail(Id),
	CONSTRAINT PostCurrentDetail_Post_FK FOREIGN KEY (PostId) REFERENCES [sunrise-real-estate].dbo.Post(Id) ON DELETE CASCADE
);


-- [sunrise-real-estate].dbo.DraftCurrentDetail definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.DraftCurrentDetail;

CREATE TABLE [sunrise-real-estate].dbo.DraftCurrentDetail (
	Id uniqueidentifier DEFAULT NEWID() NOT NULL,
	DraftId uniqueidentifier NOT NULL,
	DetailId uniqueidentifier NOT NULL,
	Value nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CreatedDate datetimeoffset(0) DEFAULT sysdatetimeoffset() NULL,
	CONSTRAINT DraftCurrentDetail_PK PRIMARY KEY (Id),
	CONSTRAINT DraftCurrentDetail_DraftPost_FK FOREIGN KEY (DraftId) REFERENCES [sunrise-real-estate].dbo.DraftPost(Id) ON DELETE CASCADE,
	CONSTRAINT DraftCurrentDetail_PostDetail_FK FOREIGN KEY (DetailId) REFERENCES [sunrise-real-estate].dbo.PostDetail(Id)
);


-- [sunrise-real-estate].dbo.DraftFeature definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.DraftFeature;

CREATE TABLE [sunrise-real-estate].dbo.DraftFeature (
	Id uniqueidentifier DEFAULT NEWID() NOT NULL,
	Title nvarchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	Description nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	DraftId uniqueidentifier NOT NULL,
	CreatedDate datetimeoffset(0) DEFAULT sysdatetimeoffset() NULL,
	CONSTRAINT DraftFeature_PK PRIMARY KEY (Id),
	CONSTRAINT DraftFeature_DraftPost_FK FOREIGN KEY (DraftId) REFERENCES [sunrise-real-estate].dbo.DraftPost(Id) ON DELETE CASCADE
);


-- [sunrise-real-estate].dbo.PostFeature definition

-- Drop table

-- DROP TABLE [sunrise-real-estate].dbo.PostFeature;

CREATE TABLE [sunrise-real-estate].dbo.PostFeature (
	Id uniqueidentifier DEFAULT NEWID() NOT NULL,
	Title nvarchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	Description nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	PostId uniqueidentifier NOT NULL,
	CreatedDate datetimeoffset(0) DEFAULT sysdatetimeoffset() NULL,
	CONSTRAINT PostFeature_PK PRIMARY KEY (Id),
	CONSTRAINT PostFeature_Post_FK FOREIGN KEY (PostId) REFERENCES [sunrise-real-estate].dbo.Post(Id) ON DELETE CASCADE
);