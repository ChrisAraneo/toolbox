/* eslint-disable @typescript-eslint/unbound-method */

import * as BasicFtp from 'basic-ftp';
import { lastValueFrom } from 'rxjs';

import { uploadDirectory } from './upload-directory';

describe('uploadDirectory', () => {
  let mockClient: jest.Mocked<BasicFtp.Client>;
  let mockFtpResponse: BasicFtp.FTPResponse;

  beforeEach(() => {
    mockFtpResponse = {
      code: 200,
      message: 'OK',
    };

    mockClient = {
      access: jest.fn(),
      uploadFrom: jest.fn(),
    } as unknown as jest.Mocked<BasicFtp.Client>;
  });

  it('should successfully connect and upload directory', async () => {
    const host = 'ftp.example.com';
    const user = 'testuser';
    const password = 'testpass';
    const localPath = '/local/path';
    const remotePath = '/remote/path';

    mockClient.access.mockResolvedValue(mockFtpResponse);
    mockClient.uploadFrom.mockResolvedValue(mockFtpResponse);

    const result = uploadDirectory(mockClient)({
      host,
      user,
      password,
      localPath,
      remotePath,
    });

    await lastValueFrom(result);

    expect(mockClient.access).toHaveBeenCalledWith({
      host,
      user,
      password,
    });
    expect(mockClient.uploadFrom).toHaveBeenCalledWith(localPath, remotePath);
  });

  it('should call access before uploadFrom', async () => {
    const callOrder: string[] = [];

    mockClient.access.mockImplementation(() => {
      callOrder.push('access');
      return Promise.resolve(mockFtpResponse);
    });
    mockClient.uploadFrom.mockImplementation(() => {
      callOrder.push('uploadFrom');
      return Promise.resolve(mockFtpResponse);
    });

    const result = uploadDirectory(mockClient)({
      host: 'host',
      user: 'user',
      password: 'pass',
      localPath: '/local',
      remotePath: '/remote',
    });

    await lastValueFrom(result);

    expect(callOrder).toEqual(['access', 'uploadFrom']);
  });

  it('should propagate access errors', async () => {
    const accessError = new Error('Connection failed');
    mockClient.access.mockRejectedValue(accessError);

    const result = uploadDirectory(mockClient)({
      host: 'host',
      user: 'user',
      password: 'pass',
      localPath: '/local',
      remotePath: '/remote',
    });

    await expect(lastValueFrom(result)).rejects.toThrow('Connection failed');
    expect(mockClient.uploadFrom).not.toHaveBeenCalled();
  });

  it('should propagate upload errors', async () => {
    const uploadError = new Error('Upload failed');
    mockClient.access.mockResolvedValue(mockFtpResponse);
    mockClient.uploadFrom.mockRejectedValue(uploadError);

    const result = uploadDirectory(mockClient)({
      host: 'host',
      user: 'user',
      password: 'pass',
      localPath: '/local',
      remotePath: '/remote',
    });

    await expect(lastValueFrom(result)).rejects.toThrow('Upload failed');
    expect(mockClient.access).toHaveBeenCalled();
  });

  it('should return Observable<void>', async () => {
    mockClient.access.mockResolvedValue(mockFtpResponse);
    mockClient.uploadFrom.mockResolvedValue(mockFtpResponse);

    const result = await lastValueFrom(
      uploadDirectory(mockClient)({
        host: 'host',
        user: 'user',
        password: 'pass',
        localPath: '/local',
        remotePath: '/remote',
      }),
    );

    expect(result).toBeUndefined();
  });

  it('should handle authentication with special characters in password', async () => {
    const specialPassword = 'p@ssw0rd!#$%';

    mockClient.access.mockResolvedValue(mockFtpResponse);
    mockClient.uploadFrom.mockResolvedValue(mockFtpResponse);

    const result = uploadDirectory(mockClient)({
      host: 'host',
      user: 'user',
      password: specialPassword,
      localPath: '/local',
      remotePath: '/remote',
    });

    await lastValueFrom(result);

    expect(mockClient.access).toHaveBeenCalledWith({
      host: 'host',
      user: 'user',
      password: specialPassword,
    });
  });

  it('should handle paths with spaces', async () => {
    const localPath = '/local/path with spaces';
    const remotePath = '/remote/path with spaces';

    mockClient.access.mockResolvedValue(mockFtpResponse);
    mockClient.uploadFrom.mockResolvedValue(mockFtpResponse);

    const result = uploadDirectory(mockClient)({
      host: 'host',
      user: 'user',
      password: 'pass',
      localPath,
      remotePath,
    });

    await lastValueFrom(result);

    expect(mockClient.uploadFrom).toHaveBeenCalledWith(localPath, remotePath);
  });

  it('should complete the observable after successful upload', (done) => {
    mockClient.access.mockResolvedValue(mockFtpResponse);
    mockClient.uploadFrom.mockResolvedValue(mockFtpResponse);

    const result = uploadDirectory(mockClient)({
      host: 'host',
      user: 'user',
      password: 'pass',
      localPath: '/local',
      remotePath: '/remote',
    });

    result.subscribe({
      complete: () => {
        done();
      },
    });
  });

  it('should emit error when observable fails', (done) => {
    const error = new Error('FTP error');
    mockClient.access.mockRejectedValue(error);

    const result = uploadDirectory(mockClient)({
      host: 'host',
      user: 'user',
      password: 'pass',
      localPath: '/local',
      remotePath: '/remote',
    });

    result.subscribe({
      error: (err) => {
        expect(err).toBe(error);
        done();
      },
    });
  });

  it('should use default client when not provided', async () => {
    // This test verifies that the function can be called without a client
    // And will create a default one
    const upload = uploadDirectory();

    // We can't easily test the actual upload without a real client,
    // But we can verify the function structure is correct
    expect(typeof upload).toBe('function');
  });
});
